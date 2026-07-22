from __future__ import annotations

import argparse
import json
import math
import shutil
import subprocess
import sys
import time
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = ROOT / "blender" / "config.json"
CONFIG = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
SOURCE = ROOT / CONFIG["sourceScene"]
WORKING = ROOT / CONFIG["workingScene"]
REPORTS = ROOT / "blender" / "reports"
PREVIEWS = ROOT / "blender" / "previews"

COLORS = {
    "graphite": (0.018, 0.024, 0.028, 1),
    "raised": (0.035, 0.046, 0.050, 1),
    "desk": (0.29, 0.27, 0.23, 1),
    "desk_edge": (0.17, 0.16, 0.14, 1),
    "warm": (1.0, 0.52, 0.08, 1),
    "skin": (0.42, 0.28, 0.20, 1),
    "shirt": (0.055, 0.065, 0.07, 1),
    "cyan": (0.035, 0.50, 0.58, 1),
    "orange": (0.88, 0.30, 0.065, 1),
    "screen": (0.018, 0.055, 0.060, 1),
    "paper": (0.58, 0.55, 0.47, 1),
}


def ensure_dirs() -> None:
    for path in [SOURCE.parent, WORKING.parent, REPORTS, PREVIEWS]:
        path.mkdir(parents=True, exist_ok=True)
    for item in CONFIG["sequences"].values():
        (ROOT / item["directory"]).mkdir(parents=True, exist_ok=True)
    (ROOT / "public/cinematic/posters").mkdir(parents=True, exist_ok=True)
    (ROOT / "public/cinematic/mobile").mkdir(parents=True, exist_ok=True)
    (ROOT / "public/models").mkdir(parents=True, exist_ok=True)


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)


def material(name: str, color, roughness: float = 0.72, emission=None, strength: float = 0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = roughness
    if "Metallic" in bsdf.inputs:
        bsdf.inputs["Metallic"].default_value = 0.02
    if emission is not None:
        key = "Emission Color" if "Emission Color" in bsdf.inputs else "Emission"
        bsdf.inputs[key].default_value = emission
        bsdf.inputs["Emission Strength"].default_value = strength
    return mat


def assign(obj, mat) -> None:
    if hasattr(obj.data, "materials"):
        obj.data.materials.append(mat)


def box(name: str, location, dimensions, mat, rotation=(0, 0, 0), bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    assign(obj, mat)
    if bevel:
        mod = obj.modifiers.new("restrained_edges", "BEVEL")
        mod.width = bevel
        mod.segments = 2
    return obj


def cylinder(name: str, location, radius, depth, mat, rotation=(0, 0, 0), vertices=12):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    assign(obj, mat)
    return obj


def sphere(name: str, location, scale, mat):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    assign(obj, mat)
    return obj


def key(obj, frame: int, location=None, rotation=None, scale=None) -> None:
    if location is not None:
        obj.location = location
        obj.keyframe_insert("location", frame=frame)
    if rotation is not None:
        obj.rotation_euler = rotation
        obj.keyframe_insert("rotation_euler", frame=frame)
    if scale is not None:
        obj.scale = scale
        obj.keyframe_insert("scale", frame=frame)


def key_emission(mat, frame: int, value: float) -> None:
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    strength = bsdf.inputs.get("Emission Strength")
    if strength:
        strength.default_value = value
        strength.keyframe_insert("default_value", frame=frame)


def look_at(obj, target) -> None:
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def camera_key(camera, frame: int, location, target) -> None:
    camera.location = location
    look_at(camera, target)
    camera.keyframe_insert("location", frame=frame)
    camera.keyframe_insert("rotation_euler", frame=frame)


def set_interpolation() -> None:
    for obj in bpy.data.objects:
        if not obj.animation_data or not obj.animation_data.action:
            continue
        obj.animation_data.action.name = f"cinematic__{obj.name}"
        for curve in getattr(obj.animation_data.action, "fcurves", []):
            for point in curve.keyframe_points:
                point.interpolation = "BEZIER"
                point.handle_left_type = "AUTO_CLAMPED"
                point.handle_right_type = "AUTO_CLAMPED"
    for mat in bpy.data.materials:
        tree = mat.node_tree
        if not tree or not tree.animation_data or not tree.animation_data.action:
            continue
        tree.animation_data.action.name = f"cinematic__{mat.name}"
        for curve in getattr(tree.animation_data.action, "fcurves", []):
            for point in curve.keyframe_points:
                point.interpolation = "BEZIER"


def configure_render(scene) -> None:
    width, height = CONFIG["resolution"]
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.resolution_percentage = 100
    scene.render.fps = CONFIG["frameRate"]
    scene.render.image_settings.file_format = "WEBP"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.image_settings.color_depth = "8"
    scene.render.image_settings.quality = CONFIG["quality"]
    scene.render.film_transparent = False
    scene.render.use_file_extension = True
    scene.render.image_settings.color_management = "FOLLOW_SCENE"
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.view_settings.exposure = 0.0
    scene.view_settings.gamma = 1.0


def create_scene() -> None:
    ensure_dirs()
    clear_scene()
    scene = bpy.context.scene
    scene.name = "Living Workspace Cinematic"
    configure_render(scene)
    scene.frame_start = 1
    scene.frame_end = 384
    scene["supported_clips"] = "idle_work,typing_loop,inspect_screen,use_mouse,check_notebook,short_break,initialize,project_switch,contact_complete"
    scene["source_note"] = "Generated Blender counterpart of src/components/workspace-scene.tsx"

    mats = {
        "graphite": material("graphite_matte", COLORS["graphite"], 0.82),
        "raised": material("raised_graphite", COLORS["raised"], 0.76),
        "desk": material("warm_grey_desk", COLORS["desk"], 0.80),
        "edge": material("desk_edge", COLORS["desk_edge"], 0.84),
        "warm": material("lamp_warm", COLORS["warm"], 0.68, COLORS["warm"], 0.0),
        "skin": material("developer_skin", COLORS["skin"], 0.88),
        "shirt": material("developer_clothing", COLORS["shirt"], 0.92),
        "cyan": material("systems_cyan", COLORS["cyan"], 0.48, COLORS["cyan"], 0.0),
        "orange": material("projects_orange", COLORS["orange"], 0.48, COLORS["orange"], 0.0),
        "screen": material("monitor_screen", COLORS["screen"], 0.42, COLORS["cyan"], 0.0),
        "paper": material("notebook_paper", COLORS["paper"], 0.92),
    }

    box("graphite_platform", (0, 0.4, 0.0), (12.5, 7.4, 0.34), mats["graphite"], bevel=0.14)
    box("desk_top", (0, 0, 2.36), (7.6, 3.1, 0.22), mats["desk"], bevel=0.07)
    for x in (-3.35, 3.35):
        for y in (-1.15, 1.15):
            box(f"desk_leg_{x}_{y}", (x, y, 1.15), (0.20, 0.20, 2.3), mats["edge"])

    box("monitor_body", (0.2, 0.8, 4.05), (4.5, 0.24, 2.45), mats["raised"], bevel=0.10)
    screen = box("primary_screen", (0.2, 0.655, 4.06), (4.06, 0.05, 2.05), mats["screen"], bevel=0.04)
    box("monitor_stem", (0.2, 0.86, 2.78), (0.22, 0.22, 0.72), mats["edge"])
    box("monitor_base", (0.2, 0.82, 2.48), (1.45, 0.65, 0.10), mats["edge"], bevel=0.04)
    keyboard = box("keyboard", (0.05, -0.82, 2.54), (3.1, 0.92, 0.12), mats["raised"], rotation=(math.radians(4), 0, 0), bevel=0.04)
    for row in range(3):
        for col in range(10):
            box(f"key_{row}_{col}", (-1.18 + col * 0.27, -1.08 + row * 0.22, 2.625), (0.19, 0.15, 0.04), mats["edge"], bevel=0.015)
    mouse = box("mouse", (2.1, -0.82, 2.57), (0.48, 0.72, 0.18), mats["raised"], bevel=0.10)

    notebook = box("notebook", (-2.68, -0.72, 2.56), (1.40, 1.02, 0.10), mats["paper"], rotation=(0, 0, math.radians(-8)), bevel=0.035)
    box("notebook_spine", (-3.31, -0.81, 2.62), (0.06, 0.98, 0.05), mats["orange"], rotation=(0, 0, math.radians(-8)))
    cylinder("pen", (-2.45, -0.74, 2.68), 0.035, 0.92, mats["orange"], rotation=(0, math.radians(90), math.radians(22)), vertices=10)

    box("server_chassis", (4.25, 0.45, 1.70), (1.18, 1.55, 2.75), mats["raised"], bevel=0.08)
    for row in range(5):
        box(f"server_slot_{row}", (4.25, -0.345, 0.92 + row * 0.39), (0.88, 0.04, 0.18), mats["edge"], bevel=0.02)
        cylinder(f"server_indicator_{row}", (4.58, -0.39, 0.92 + row * 0.39), 0.035, 0.035, mats["cyan"], rotation=(math.radians(90), 0, 0), vertices=8)

    box("lamp_base", (2.95, 0.02, 2.55), (0.78, 0.78, 0.10), mats["edge"], bevel=0.08)
    cylinder("lamp_stem", (2.95, 0.12, 3.35), 0.075, 1.62, mats["edge"], rotation=(math.radians(-8), 0, 0), vertices=12)
    lamp_shade = cylinder("lamp_shade", (2.95, -0.02, 4.15), 0.42, 0.52, mats["warm"], rotation=(math.radians(90), 0, 0), vertices=12)

    for x in (-4.5, 4.5):
        box(f"frame_vertical_{x}", (x, 2.25, 3.55), (0.16, 0.18, 5.6), mats["raised"])
    for z in (0.80, 6.30):
        box(f"frame_horizontal_{z}", (0, 2.25, z), (9.15, 0.18, 0.16), mats["raised"])
    modules = []
    for index, x in enumerate((-3.4, -2.0, -0.6, 0.8, 2.2, 3.6)):
        module = box(f"computational_module_{index}", (x, 2.10, 4.95 if index % 2 else 1.70), (0.88, 0.42, 0.66), mats["raised"], bevel=0.06)
        modules.append(module)

    cyan_segments = []
    orange_segments = []
    for index in range(8):
        cyan_segments.append(box(f"cyan_path_{index}", (-4.0 + index * 0.82, 1.92, 1.04 + (index % 2) * 0.28), (0.60, 0.05, 0.055), mats["cyan"], rotation=(0, math.radians((index % 2) * 10), 0)))
        orange_segments.append(box(f"orange_path_{index}", (-3.7 + index * 0.88, 1.88, 5.72 - (index % 3) * 0.22), (0.62, 0.05, 0.055), mats["orange"], rotation=(0, math.radians(-(index % 2) * 12), 0)))

    box("chair_seat", (0.45, -2.00, 1.78), (1.38, 1.18, 0.22), mats["raised"], bevel=0.09)
    box("chair_back", (0.45, -2.45, 2.80), (1.42, 0.24, 2.08), mats["raised"], rotation=(math.radians(-7), 0, 0), bevel=0.09)
    cylinder("chair_column", (0.45, -2.0, 0.90), 0.12, 1.55, mats["edge"], vertices=12)

    pelvis = box("developer_pelvis", (0.45, -1.85, 2.30), (0.92, 0.62, 0.56), mats["shirt"], bevel=0.10)
    torso = box("developer_torso", (0.45, -1.63, 3.08), (1.16, 0.72, 1.35), mats["shirt"], rotation=(math.radians(-8), 0, 0), bevel=0.13)
    neck = cylinder("developer_neck", (0.45, -1.50, 3.86), 0.16, 0.32, mats["skin"], vertices=10)
    head = sphere("developer_head", (0.45, -1.35, 4.30), (0.44, 0.40, 0.52), mats["skin"])
    left_upper = cylinder("developer_left_upper_arm", (-0.22, -1.38, 3.14), 0.15, 0.92, mats["shirt"], rotation=(math.radians(68), math.radians(-6), math.radians(-8)), vertices=10)
    right_upper = cylinder("developer_right_upper_arm", (1.12, -1.38, 3.14), 0.15, 0.92, mats["shirt"], rotation=(math.radians(68), math.radians(6), math.radians(8)), vertices=10)
    left_hand = sphere("developer_left_hand", (-0.50, -0.88, 2.70), (0.22, 0.30, 0.15), mats["skin"])
    right_hand = sphere("developer_right_hand", (1.25, -0.90, 2.70), (0.22, 0.30, 0.15), mats["skin"])

    world = scene.world or bpy.data.worlds.new("Living Workspace World")
    scene.world = world
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.004, 0.008, 0.010, 1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.13

    bpy.ops.object.light_add(type="AREA", location=(2.5, -4.0, 8.8))
    key_light = bpy.context.object
    key_light.name = "soft_key"
    key_light.data.energy = 0
    key_light.data.shape = "DISK"
    key_light.data.size = 5.0
    key_light.data.color = (0.82, 0.78, 0.68)
    look_at(key_light, (0, 0, 2.5))
    bpy.ops.object.light_add(type="AREA", location=(-5.0, 1.0, 5.5))
    fill_light = bpy.context.object
    fill_light.name = "cyan_fill"
    fill_light.data.energy = 220
    fill_light.data.size = 4.0
    fill_light.data.color = (0.20, 0.62, 0.68)
    look_at(fill_light, (0, 0.8, 3.0))
    bpy.ops.object.light_add(type="POINT", location=(2.9, -0.35, 3.95))
    practical = bpy.context.object
    practical.name = "lamp_practical"
    practical.data.energy = 0
    practical.data.color = (1.0, 0.58, 0.12)
    practical.data.shadow_soft_size = 1.2

    bpy.ops.object.camera_add(location=(12.0, -16.0, 8.5))
    camera = bpy.context.object
    camera.name = "cinematic_camera"
    camera.data.lens = 52
    camera.data.sensor_width = 36
    scene.camera = camera
    look_at(camera, (0.2, 0.2, 2.8))

    # Initialization: light, posture and signal wake in deliberately separated beats.
    camera_key(camera, 1, (12.0, -16.0, 8.5), (0.1, 0.3, 2.8))
    camera_key(camera, 120, (10.1, -13.1, 7.15), (0.15, 0.3, 2.9))
    key(head, 1, rotation=(math.radians(13), 0, math.radians(-4)))
    key(head, 58, rotation=(math.radians(4), 0, 0))
    key(head, 120, rotation=(0, 0, 0))
    key(left_hand, 1, location=(-0.72, -1.14, 2.74))
    key(right_hand, 1, location=(1.42, -1.12, 2.74))
    key(left_hand, 88, location=(-0.50, -0.88, 2.70))
    key(right_hand, 96, location=(1.25, -0.90, 2.70))
    for frame, energy in ((1, 18), (26, 18), (48, 720), (120, 860)):
        key_light.data.energy = energy
        key_light.data.keyframe_insert("energy", frame=frame)
    for frame, energy in ((1, 0), (18, 0), (38, 1100), (120, 1450)):
        practical.data.energy = energy
        practical.data.keyframe_insert("energy", frame=frame)
    for frame, value in ((1, 0.0), (30, 0.0), (48, 1.0), (120, 1.6)):
        key_emission(mats["warm"], frame, value)
    for frame, value in ((1, 0.0), (34, 0.0), (64, 1.5), (120, 2.0)):
        key_emission(mats["screen"], frame, value)
    for frame, value in ((1, 0.0), (46, 0.0), (82, 2.3), (120, 3.0)):
        key_emission(mats["cyan"], frame, value)
    for frame, value in ((1, 0.0), (120, 0.0)):
        key_emission(mats["orange"], frame, value)
    for index, module in enumerate(modules):
        final = module.location.copy()
        key(module, 1, location=(final.x, 3.15, final.z), scale=(0.72, 0.72, 0.72))
        key(module, 62 + index * 6, location=final, scale=(1, 1, 1))

    # Transformation: mouse intent, orange relationships and modules reorganize.
    camera_key(camera, 121, (10.1, -13.1, 7.15), (0.15, 0.3, 2.9))
    camera_key(camera, 264, (7.55, -10.2, 6.15), (0.65, 0.8, 3.30))
    key(right_hand, 121, location=(1.25, -0.90, 2.70))
    key(right_hand, 158, location=(2.05, -0.83, 2.72))
    key(right_hand, 198, location=(2.05, -0.83, 2.72))
    key(right_hand, 250, location=(1.25, -0.90, 2.70))
    key(head, 121, rotation=(0, 0, 0))
    key(head, 206, rotation=(math.radians(-2), 0, math.radians(-8)))
    key(head, 264, rotation=(math.radians(-1), 0, math.radians(-6)))
    for frame, value in ((121, 1.6), (206, 1.5), (264, 1.4)):
        key_emission(mats["warm"], frame, value)
    for frame, value in ((121, 0.0), (158, 0.25), (206, 2.4), (264, 3.2)):
        key_emission(mats["orange"], frame, value)
    for frame, value in ((121, 3.0), (206, 2.5), (264, 1.8)):
        key_emission(mats["cyan"], frame, value)
    for frame, value in ((121, 2.0), (206, 2.6), (264, 3.0)):
        key_emission(mats["screen"], frame, value)
    for index, module in enumerate(modules):
        base = module.location.copy()
        target_z = 3.35 + ((index % 3) - 1) * 1.05
        key(module, 121, location=base, rotation=(0, 0, 0))
        key(module, 190 + index * 6, location=(base.x * 0.92, 1.82, target_z), rotation=(0, math.radians((index - 2.5) * 5), math.radians((index % 2) * 6 - 3)))
        key(module, 264, location=(base.x * 0.92, 1.82, target_z), rotation=(0, math.radians((index - 2.5) * 5), math.radians((index % 2) * 6 - 3)))

    # Details: a calm, right-weighted observation that protects the semantic content field.
    camera_key(camera, 265, (7.55, -10.2, 6.15), (0.65, 0.8, 3.30))
    camera_key(camera, 296, (8.80, -10.80, 6.40), (1.50, 0.50, 3.00))
    camera_key(camera, 326, (7.20, -9.20, 5.80), (1.00, 0.30, 3.00))
    camera_key(camera, 355, (9.00, -11.50, 6.80), (0.30, 0.50, 3.00))
    camera_key(camera, 384, (10.60, -13.40, 7.50), (0.10, 0.40, 3.00))
    key(left_hand, 265, location=(-0.50, -0.88, 2.70))
    key(left_hand, 300, location=(-0.48, -0.84, 2.74))
    key(left_hand, 326, location=(-0.54, -0.91, 2.68))
    key(left_hand, 352, location=(-0.48, -0.84, 2.74))
    key(left_hand, 384, location=(-0.50, -0.88, 2.70))
    key(right_hand, 265, location=(1.25, -0.90, 2.70))
    key(right_hand, 312, location=(1.20, -0.86, 2.74))
    key(right_hand, 348, location=(1.28, -0.92, 2.68))
    key(right_hand, 384, location=(1.25, -0.90, 2.70))
    for frame, value in ((265, 1.4), (326, 1.8), (384, 2.4)):
        key_emission(mats["warm"], frame, value)
    for frame, value in ((265, 1.8), (326, 1.4), (384, 1.1)):
        key_emission(mats["cyan"], frame, value)
    for frame, value in ((265, 3.2), (326, 2.4), (384, 1.6)):
        key_emission(mats["orange"], frame, value)
    for frame, value in ((265, 3.0), (326, 2.4), (384, 1.7)):
        key_emission(mats["screen"], frame, value)
    for frame, energy in ((265, 1200), (326, 1550), (384, 1900)):
        practical.data.energy = energy
        practical.data.keyframe_insert("energy", frame=frame)
    for frame, energy in ((265, 920), (326, 860), (384, 820)):
        key_light.data.energy = energy
        key_light.data.keyframe_insert("energy", frame=frame)

    set_interpolation()
    scene.frame_set(120)
    bpy.ops.wm.save_as_mainfile(filepath=str(WORKING))
    if not SOURCE.exists():
        shutil.copy2(WORKING, SOURCE)


def inspect_scene() -> None:
    ensure_dirs()
    scene = bpy.context.scene
    missing = []
    for image in bpy.data.images:
        if image.source == "FILE" and image.filepath and not bpy.path.abspath(image.filepath):
            missing.append(image.filepath)
    objects = []
    total_triangles = 0
    unapplied = []
    hidden = []
    for obj in scene.objects:
        triangles = 0
        if obj.type == "MESH":
            mesh = obj.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh()
            mesh.calc_loop_triangles()
            triangles = len(mesh.loop_triangles)
            total_triangles += triangles
            obj.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh_clear()
        if any(abs(value - 1) > 0.001 for value in obj.scale):
            unapplied.append(obj.name)
        if obj.hide_render or obj.hide_viewport:
            hidden.append(obj.name)
        objects.append({
            "name": obj.name,
            "type": obj.type,
            "parent": obj.parent.name if obj.parent else None,
            "triangles": triangles,
            "origin": list(obj.location),
            "scale": list(obj.scale),
            "materials": [slot.material.name for slot in obj.material_slots if slot.material],
        })
    duplicates = {}
    for mat in bpy.data.materials:
        stem = mat.name.rsplit(".", 1)[0]
        duplicates.setdefault(stem, []).append(mat.name)
    duplicates = {key: value for key, value in duplicates.items() if len(value) > 1}
    report = {
        "blenderVersion": bpy.app.version_string,
        "scene": scene.name,
        "collections": [collection.name for collection in bpy.data.collections],
        "activeCamera": scene.camera.name if scene.camera else None,
        "cameras": [obj.name for obj in scene.objects if obj.type == "CAMERA"],
        "lights": [{"name": obj.name, "type": obj.data.type, "energy": obj.data.energy} for obj in scene.objects if obj.type == "LIGHT"],
        "renderEngine": scene.render.engine,
        "world": scene.world.name if scene.world else None,
        "resolution": [scene.render.resolution_x, scene.render.resolution_y],
        "objects": objects,
        "totalEstimatedTriangles": total_triangles,
        "materials": [mat.name for mat in bpy.data.materials],
        "images": [image.name for image in bpy.data.images],
        "missingExternalFiles": missing,
        "armatures": [obj.name for obj in scene.objects if obj.type == "ARMATURE"],
        "actions": [action.name for action in bpy.data.actions],
        "nlaTracks": sum((len(obj.animation_data.nla_tracks) if obj.animation_data else 0) for obj in scene.objects),
        "frameRange": [scene.frame_start, scene.frame_end],
        "unappliedTransforms": unapplied,
        "hiddenGeometry": hidden,
        "duplicateMaterials": duplicates,
        "warnings": ["No armature is present; character movement uses constrained object transforms."] if not [obj for obj in scene.objects if obj.type == "ARMATURE"] else [],
    }
    (REPORTS / "scene-inspection.json").write_text(json.dumps(report, indent=2), encoding="utf-8")


def render_still(frame: int, path: Path) -> None:
    scene = bpy.context.scene
    scene.frame_set(frame)
    scene.render.filepath = str(path.with_suffix(""))
    bpy.ops.render.render(write_still=True)


def resolve_sequences(names: list[str] | None = None) -> list[str]:
    selected = names or list(CONFIG["sequences"])
    unknown = [name for name in selected if name not in CONFIG["sequences"]]
    if unknown:
        raise ValueError(f"Unknown cinematic sequences: {', '.join(unknown)}")
    return selected


def render_samples(names: list[str] | None = None) -> None:
    ensure_dirs()
    selected = resolve_sequences(names)
    for name in selected:
        item = CONFIG["sequences"][name]
        start, end = item["start"], item["end"]
        span = end - start
        samples = {
            "first": start,
            "quarter": start + round(span * 0.25),
            "middle": start + round(span * 0.50),
            "three-quarter": start + round(span * 0.75),
            "final": end,
        }
        for label, frame in samples.items():
            render_still(frame, PREVIEWS / f"{name}_{label}.webp")
    if "initialize" in selected:
        render_still(120, ROOT / "public/cinematic/posters/workspace-anchor.webp")


def render_sequences(names: list[str] | None = None) -> None:
    ensure_dirs()
    selected = resolve_sequences(names)
    report_path = REPORTS / "render-report.json"
    previous = json.loads(report_path.read_text(encoding="utf-8")) if report_path.exists() else {"sequences": []}
    sequence_reports = {item["name"]: item for item in previous.get("sequences", [])}
    report = {"blenderVersion": bpy.app.version_string, "startedAt": time.time(), "targetedSequences": selected, "sequences": []}
    for name in selected:
        item = CONFIG["sequences"][name]
        start_time = time.time()
        directory = ROOT / item["directory"]
        for existing in directory.glob("frame_*.webp"):
            existing.unlink()
        for global_frame in range(item["start"], item["end"] + 1):
            local_frame = global_frame - item["start"] + 1
            render_still(global_frame, directory / f"frame_{local_frame:04d}.webp")
        poster = ROOT / f"public/cinematic/posters/{name}.webp"
        shutil.copy2(directory / "frame_0001.webp", poster)
        files = sorted(directory.glob("frame_*.webp"))
        total_size = sum(path.stat().st_size for path in files)
        expected = item["end"] - item["start"] + 1
        sequence_reports[name] = {
            "name": name,
            "frameStart": item["start"],
            "frameEnd": item["end"],
            "renderedFrameCount": len(files),
            "missingFrames": [index for index in range(1, expected + 1) if not (directory / f"frame_{index:04d}.webp").exists()],
            "resolution": CONFIG["resolution"],
            "format": CONFIG["format"],
            "totalSize": total_size,
            "averageFrameSize": round(total_size / max(1, len(files))),
            "renderDurationSeconds": round(time.time() - start_time, 2),
            "warnings": [],
        }
    report["sequences"] = [sequence_reports[name] for name in CONFIG["sequences"] if name in sequence_reports]
    report["finishedAt"] = time.time()
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

def export_glb() -> None:
    render_only = {"cinematic_camera", "soft_key", "cyan_fill", "lamp_practical"}
    bpy.ops.object.select_all(action="DESELECT")
    for obj in bpy.context.scene.objects:
        if obj.name not in render_only and not obj.hide_render:
            obj.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=str(ROOT / "public/models/developer-workspace.glb"),
        export_format="GLB",
        use_selection=True,
        export_animations=True,
        export_materials="EXPORT",
    )


def validate_outputs() -> None:
    from PIL import Image
    failures = []
    total_size = 0
    for name, item in CONFIG["sequences"].items():
        directory = ROOT / item["directory"]
        expected = item["end"] - item["start"] + 1
        for index in range(1, expected + 1):
            path = directory / f"frame_{index:04d}.webp"
            if not path.exists():
                failures.append(f"Missing {path.relative_to(ROOT)}")
                continue
            total_size += path.stat().st_size
            with Image.open(path) as image:
                if list(image.size) != CONFIG["resolution"]:
                    failures.append(f"Wrong dimensions for {path.relative_to(ROOT)}: {image.size}")
    if total_size > 40 * 1024 * 1024:
        failures.append(f"Cinematic frames exceed 40 MB: {total_size / 1024 / 1024:.2f} MB")
    required = [
        ROOT / "public/cinematic/posters/workspace-anchor.webp",
        ROOT / "public/models/developer-workspace.glb",
    ]
    for path in required:
        if not path.exists() or path.stat().st_size == 0:
            failures.append(f"Missing required output {path.relative_to(ROOT)}")
    result = {"valid": not failures, "totalFrameBytes": total_size, "failures": failures}
    (REPORTS / "validation-report.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    if failures:
        raise RuntimeError("\n".join(failures))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["prepare", "inspect", "samples", "render", "export", "validate"])
    parser.add_argument("--sequences", nargs="*")
    args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else [])
    if args.action == "prepare":
        create_scene()
    elif args.action == "inspect":
        inspect_scene()
    elif args.action == "samples":
        render_samples(args.sequences)
    elif args.action == "render":
        render_sequences(args.sequences)
    elif args.action == "export":
        export_glb()
    elif args.action == "validate":
        validate_outputs()


if __name__ == "__main__":
    main()
