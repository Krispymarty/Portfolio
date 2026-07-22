import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import bpy
from pipeline import configure_render

configure_render(bpy.context.scene)
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
