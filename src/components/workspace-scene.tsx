import { ContactShadows, Environment, Lightformer, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// ────────────────────────────────────────────────────────────────────────────────
// Types & Palette Configuration
// ────────────────────────────────────────────────────────────────────────────────

type Vec3 = [number, number, number];

type WorkspaceMaterials = {
  graphite: THREE.MeshStandardMaterial;
  darkSteel: THREE.MeshStandardMaterial;
  warmGrey: THREE.MeshStandardMaterial;
  desaturatedOrange: THREE.MeshStandardMaterial;
  desaturatedCyan: THREE.MeshStandardMaterial;
  screen: THREE.MeshStandardMaterial;
  brushedRail: THREE.MeshStandardMaterial;
};

type WorkspaceSceneProps = {
  chapter: number;
  reducedMotion: boolean;
  onModelReady: (model: THREE.Group | null) => void;
};

type BoxProps = {
  size: Vec3;
  material: THREE.Material;
  position?: Vec3;
  rotation?: Vec3;
  scale?: Vec3;
  radius?: number;
  name?: string;
};

// ────────────────────────────────────────────────────────────────────────────────
// Animation Group Names Mapped to Chapters
// ────────────────────────────────────────────────────────────────────────────────

export const ANIM_GROUPS = [
  "dormant",              // 0 – intro
  "initialize",           // 1 – education
  "skills_activate",      // 2 – skills
  "project_mode_1",       // 3 – projects
  "experience_integrate", // 4 – experience
  "contact_transmit",     // 5 – contact
] as const;

export const ANIM_CLIPS = [
  "idle_work",
  "initialize",
  "typing_loop",
  "inspect_screen",
  "use_mouse_or_control",
  "write_notebook",
  "stretch_break",
  "skills_activate",
  "project_switch",
  "experience_integrate",
  "contact_complete",
  "reset",
] as const;

// ────────────────────────────────────────────────────────────────────────────────
// Damping and Easing Helper
// ────────────────────────────────────────────────────────────────────────────────

function dampValue(current: number, target: number, lambda: number, delta: number) {
  return THREE.MathUtils.damp(current, target, lambda, delta);
}

// ────────────────────────────────────────────────────────────────────────────────
// Procedural Canvas Texture Generator for IDE / Code Editor Screen
// ────────────────────────────────────────────────────────────────────────────────

function useProceduralIDETexture() {
  const canvasTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Texture();

    // Theme color base
    ctx.fillStyle = "#0c1316";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sidebar panel divider
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, 0);
    ctx.lineTo(180, canvas.height);
    ctx.stroke();

    // Sidebar: file tree mock structure
    ctx.font = "bold 13px ui-monospace, monospace";
    ctx.fillStyle = "#4a6c75";
    ctx.fillText("EXPLORER: STACKFORM", 18, 30);

    const files = [
      "▾ src",
      "  ▾ components",
      "    WorkspaceScene.tsx",
      "    PortfolioOverlay.tsx",
      "  ▾ styles",
      "    index.css",
      "  App.tsx",
      "  main.tsx",
      "package.json",
    ];

    files.forEach((file, index) => {
      ctx.fillStyle = file.includes("WorkspaceScene") ? "#81b99a" : file.includes("▾") ? "#6d8e96" : "#4f6c75";
      ctx.fillText(file, 22, 65 + index * 24);
    });

    // Editor Header tab
    ctx.fillStyle = "#121d21";
    ctx.fillRect(180, 0, canvas.width - 180, 40);
    ctx.fillStyle = "#d7d4ca";
    ctx.fillText("WorkspaceScene.tsx", 205, 25);
    ctx.fillStyle = "#e07a5f";
    ctx.fillText("•", 335, 25);

    // Editor tab lower indicator line
    ctx.fillStyle = "#2a9d8f";
    ctx.fillRect(180, 38, 175, 2);

    // Editor Area: lines of code
    const mockCodeLines = [
      "import { Canvas, useFrame } from '@react-three/fiber';",
      "import { RoundedBox } from '@react-three/drei';",
      "",
      "export default function WorkspaceScene() {",
      "  const materials = useWorkspaceMaterials();",
      "  const isTyping = chapter >= 1 && chapter <= 4;",
      "",
      "  // Synchronize developer posture & breathing loop",
      "  useFrame(({ clock }, delta) => {",
      "    const t = clock.elapsedTime;",
      "    pelvis.position.y = Math.sin(t * 0.6) * 0.005;",
      "    torso.rotation.x = Math.sin(t * 0.65) * 0.006;",
      "  });",
      "",
      "  return <WorkstationBase materials={materials} />;",
      "}",
    ];

    ctx.font = "12px ui-monospace, monospace";
    mockCodeLines.forEach((line, index) => {
      const y = 80 + index * 24;

      // Line numbers
      ctx.fillStyle = "#334c54";
      ctx.fillText(String(index + 1).padStart(2, "0"), 200, y);

      // Syntax Highlight Logic (Simple match-based splits)
      let x = 230;
      const tokens = line.split(/(\s+|\(|\)|\{|\}|<|>|;|=|\/)/);
      tokens.forEach((token) => {
        if (/^(export|default|function|const|let|return|import|from|class)$/.test(token)) {
          ctx.fillStyle = "#e07a5f"; // Keywords
        } else if (/^[A-Z]/.test(token)) {
          ctx.fillStyle = "#f4a261"; // Classes / Types
        } else if (/^(\/\/.*)$/.test(token)) {
          ctx.fillStyle = "#4a6c75"; // Comments
        } else if (/^['"].*['"]$/.test(token)) {
          ctx.fillStyle = "#e9c46a"; // Strings
        } else if (/^(\(|\)|\{|\}|<|>|;|=)$/.test(token)) {
          ctx.fillStyle = "#8d99ae"; // Punctuation / Operators
        } else {
          ctx.fillStyle = "#d7d4ca"; // Standard text
        }
        ctx.fillText(token, x, y);
        x += ctx.measureText(token).width;
      });
    });

    // Console output / status panel at bottom right
    ctx.fillStyle = "#0a0f12";
    ctx.fillRect(720, 280, 270, 200);
    ctx.strokeStyle = "rgba(42,157,143,0.3)";
    ctx.strokeRect(720, 280, 270, 200);

    ctx.fillStyle = "#2a9d8f";
    ctx.fillText("▾ CONSOLE: SYSTEM STATUS", 735, 305);

    ctx.fillStyle = "#6d8e96";
    ctx.fillText("> npm run dev", 735, 335);
    ctx.fillStyle = "#d7d4ca";
    ctx.fillText("✓ vite v7.3.2 ready", 735, 360);
    ctx.fillText("✓ workspace_rig_root ready", 735, 385);
    ctx.fillStyle = "#e07a5f";
    ctx.fillText("⚠ memory footprint optimal", 735, 410);

    // Live active visual graph (CPU / Network pulse mockup)
    ctx.strokeStyle = "#e07a5f";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(740, 460);
    ctx.bezierCurveTo(770, 440, 790, 470, 820, 450);
    ctx.bezierCurveTo(850, 430, 870, 465, 900, 440);
    ctx.bezierCurveTo(930, 415, 950, 455, 970, 430);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  return canvasTexture;
}

// ────────────────────────────────────────────────────────────────────────────────
// Low-Poly Geometry Helpers
// ────────────────────────────────────────────────────────────────────────────────

function SoftBox({
  size,
  material,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  radius = 0.05,
  name,
}: BoxProps) {
  return (
    <RoundedBox
      args={size}
      position={position}
      rotation={rotation}
      scale={scale}
      radius={Math.min(radius, Math.min(...size) * 0.35)}
      smoothness={2}
      castShadow
      receiveShadow
      name={name}
    >
      <primitive object={material} attach="material" />
    </RoundedBox>
  );
}

function Connector({
  from,
  to,
  material,
  radius = 0.02,
  name,
}: {
  from: Vec3;
  to: Vec3;
  material: THREE.Material;
  radius?: number;
  name?: string;
}) {
  const { midpoint, quaternion, length } = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const direction = end.clone().sub(start);
    return {
      midpoint: start.clone().add(end).multiplyScalar(0.5),
      length: direction.length(),
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize(),
      ),
    };
  }, [from, to]);

  return (
    <mesh position={midpoint} quaternion={quaternion} castShadow name={name}>
      <cylinderGeometry args={[radius, radius, length, 6]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// workspace_base
// ────────────────────────────────────────────────────────────────────────────────

function WorkstationBase({
  materials,
  chapter,
}: {
  materials: WorkspaceMaterials;
  chapter: number;
}) {
  const moduleRefs = useRef<THREE.Group[]>([]);

  useFrame((_, delta) => {
    moduleRefs.current.forEach((module, index) => {
      if (!module) return;
      const direction = index === 0 ? -1 : 1;
      const targetX = chapter === 4 ? direction * 0.26 : 0;
      const targetZ = chapter === 4 ? (index - 0.5) * 0.16 : 0;
      module.position.x = dampValue(module.position.x, targetX, 3.2, delta);
      module.position.z = dampValue(module.position.z, targetZ, 3.2, delta);
    });
  });

  return (
    <group name="workspace_base">
      <SoftBox
        size={[5.6, 0.12, 3.4]}
        position={[0, -0.92, 0]}
        radius={0.05}
        material={materials.graphite}
        name="base_primary_substrate"
      />
      <SoftBox
        size={[4.8, 0.05, 2.7]}
        position={[-0.1, -0.835, 0.05]}
        radius={0.03}
        material={materials.darkSteel}
        name="base_circuit_layer"
      />

      {/* PCB bus accents */}
      <SoftBox
        size={[3.8, 0.015, 0.06]}
        position={[-0.2, -0.8, 0.95]}
        radius={0.005}
        material={materials.desaturatedCyan}
        name="pcb_bus_cyan"
      />
      <SoftBox
        size={[3.2, 0.015, 0.06]}
        position={[0.2, -0.8, -0.85]}
        radius={0.005}
        material={materials.desaturatedOrange}
        name="pcb_bus_orange"
      />

      {/* Circuit-board grounding pads */}
      {[-1.8, -0.5, 0.8, 1.9].map((x, i) => (
        <SoftBox
          key={i}
          size={[0.22, 0.02, 0.22]}
          position={[x, -0.8, i % 2 === 0 ? 1.1 : -1.1]}
          radius={0.02}
          material={materials.warmGrey}
          name={`base_mount_pad_${i + 1}`}
        />
      ))}

      {/* Floating modular platform extensions */}
      <group
        ref={(node) => {
          if (node) moduleRefs.current[0] = node;
        }}
        position={[0, 0, 0]}
        name="platform_extension_left"
      >
        <SoftBox
          size={[1.1, 0.09, 1.2]}
          position={[-3.15, -0.94, 0.5]}
          radius={0.04}
          material={materials.graphite}
        />
        <SoftBox
          size={[0.8, 0.025, 0.85]}
          position={[-3.1, -0.88, 0.48]}
          radius={0.02}
          material={materials.warmGrey}
        />
      </group>

      <group
        ref={(node) => {
          if (node) moduleRefs.current[1] = node;
        }}
        position={[0, 0, 0]}
        name="platform_extension_right"
      >
        <SoftBox
          size={[1.3, 0.1, 1.1]}
          position={[3.2, -0.95, -0.45]}
          radius={0.04}
          material={materials.graphite}
        />
        <SoftBox
          size={[0.9, 0.025, 0.75]}
          position={[3.15, -0.88, -0.45]}
          radius={0.02}
          material={materials.darkSteel}
        />
      </group>
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// desk_surface
// ────────────────────────────────────────────────────────────────────────────────

function MainDesk({ materials }: { materials: WorkspaceMaterials }) {
  return (
    <group name="desk_surface">
      <SoftBox
        size={[4.1, 0.14, 1.6]}
        position={[-0.2, 0.02, 0.15]}
        radius={0.05}
        material={materials.warmGrey}
        name="desk_top"
      />
      <SoftBox
        size={[3.4, 0.12, 0.28]}
        position={[-0.5, -0.04, -0.76]}
        radius={0.04}
        material={materials.darkSteel}
        name="desk_back_rail"
      />
      <SoftBox
        size={[0.22, 0.82, 1.2]}
        position={[-1.85, -0.44, 0.1]}
        radius={0.05}
        material={materials.brushedRail}
        name="desk_left_leg"
      />
      <SoftBox
        size={[0.22, 0.82, 1.2]}
        position={[1.45, -0.44, 0.1]}
        radius={0.05}
        material={materials.brushedRail}
        name="desk_right_leg"
      />
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// keyboard
// ────────────────────────────────────────────────────────────────────────────────

function Keyboard({
  materials,
  chapter,
}: {
  materials: WorkspaceMaterials;
  chapter: number;
}) {
  const keyRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }, delta) => {
    keyRefs.current.forEach((key, index) => {
      if (!key) return;
      if (index === 6) {
        const blinkPhase = Math.sin(clock.elapsedTime * 1.8 + index) * 0.5 + 0.5;
        const targetOpacity = chapter >= 3 ? 0.7 + blinkPhase * 0.3 : chapter >= 1 ? 0.85 : 0.15;
        const mat = key.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = dampValue(
          mat.emissiveIntensity,
          targetOpacity * 0.28,
          4,
          delta,
        );
      }
    });
  });

  return (
    <group position={[-0.25, 0.14, 0.48]} rotation={[-0.05, 0, 0]} name="keyboard">
      <SoftBox
        size={[1.4, 0.07, 0.46]}
        radius={0.03}
        material={materials.graphite}
        name="keyboard_frame"
      />
      {Array.from({ length: 7 }).map((_, index) => (
        <mesh
          key={index}
          ref={(node) => {
            if (node) keyRefs.current[index] = node;
          }}
          position={[-0.52 + index * 0.175, 0.045, 0]}
          name={`key_block_${index + 1}`}
        >
          <boxGeometry args={[0.12, 0.02, 0.28]} />
          <primitive
            object={index === 6 ? materials.desaturatedOrange : materials.darkSteel}
            attach="material"
          />
        </mesh>
      ))}
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// primary_monitor
// ────────────────────────────────────────────────────────────────────────────────

function PrimaryMonitor({
  materials,
  chapter,
  reducedMotion,
}: {
  materials: WorkspaceMaterials;
  chapter: number;
  reducedMotion: boolean;
}) {
  const screenMeshRef = useRef<THREE.Mesh>(null);
  const bezelRef1 = useRef<THREE.Mesh>(null);
  const bezelRef2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (!screenMeshRef.current) return;

    const dormantScale = chapter === 0 ? 0 : 1;
    const contactScale = chapter === 5 ? 0.92 : 1;
    const targetY = dormantScale * contactScale;
    screenMeshRef.current.scale.y = dampValue(
      screenMeshRef.current.scale.y,
      targetY,
      reducedMotion ? 50 : 3.5,
      delta,
    );

    const isPowered = chapter >= 1;
    const blinkSlow = Math.sin(clock.elapsedTime * 1.2) * 0.5 + 0.5;
    const blinkFast = Math.sin(clock.elapsedTime * 2.6) * 0.5 + 0.5;

    [bezelRef1, bezelRef2].forEach((ref, i) => {
      if (!ref.current) return;
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      const baseIntensity = isPowered ? (i === 0 ? 0.32 : 0.24) : 0;
      const blinkValue = isPowered ? (i === 0 ? blinkSlow : blinkFast) : 0;
      const target = baseIntensity * (0.65 + blinkValue * 0.35);
      mat.emissiveIntensity = dampValue(mat.emissiveIntensity, target, 5, delta);
    });
  });

  return (
    <group position={[-0.62, 0.96, -0.32]} name="primary_monitor">
      <SoftBox
        size={[2.08, 1.16, 0.12]}
        radius={0.06}
        material={materials.graphite}
        name="monitor_housing"
      />

      <mesh ref={screenMeshRef} position={[0, 0, 0.063]} name="primary_screen">
        <planeGeometry args={[1.92, 1.02]} />
        <primitive object={materials.screen} attach="material" />
      </mesh>

      <mesh
        ref={bezelRef1}
        position={[-0.8, -0.52, 0.068]}
        name="bezel_indicator_orange"
      >
        <boxGeometry args={[0.18, 0.02, 0.008]} />
        <primitive object={materials.desaturatedOrange} attach="material" />
      </mesh>
      <mesh
        ref={bezelRef2}
        position={[-0.58, -0.52, 0.068]}
        name="bezel_indicator_cyan"
      >
        <boxGeometry args={[0.14, 0.02, 0.008]} />
        <primitive object={materials.desaturatedCyan} attach="material" />
      </mesh>

      <SoftBox
        size={[0.12, 0.52, 0.12]}
        position={[0, -0.78, -0.02]}
        radius={0.03}
        material={materials.brushedRail}
        name="monitor_stem"
      />
      <SoftBox
        size={[0.78, 0.08, 0.44]}
        position={[0, -1.02, 0.04]}
        radius={0.04}
        material={materials.brushedRail}
        name="monitor_foot"
      />
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// project_modules
// ────────────────────────────────────────────────────────────────────────────────

function ProjectModules({
  materials,
  chapter,
  reducedMotion,
}: {
  materials: WorkspaceMaterials;
  chapter: number;
  reducedMotion: boolean;
}) {
  const moduleRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!moduleRef.current) return;

    const rotTargets = [-0.12, -0.12, -0.16, -0.46, -0.28, -0.12];
    const angle = rotTargets[chapter] ?? -0.12;
    moduleRef.current.rotation.y = dampValue(
      moduleRef.current.rotation.y,
      angle,
      reducedMotion ? 50 : 3.5,
      delta,
    );

    const liftTargets = [0, 0, 0.02, 0.1, 0.04, 0];
    const lift = liftTargets[chapter] ?? 0;
    moduleRef.current.position.y = dampValue(
      moduleRef.current.position.y,
      lift,
      reducedMotion ? 50 : 3.8,
      delta,
    );

    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      const emissiveTargets = [0, 0.3, 0.5, 0.9, 0.5, 0.35];
      const target = emissiveTargets[chapter] ?? 0;
      mat.emissiveIntensity = dampValue(mat.emissiveIntensity, target, 4, delta);
    }
  });

  return (
    <group
      ref={moduleRef}
      position={[-1.88, 0.82, -0.12]}
      rotation={[0, -0.12, 0]}
      name="project_modules"
    >
      <SoftBox
        size={[1.05, 0.68, 0.1]}
        radius={0.05}
        material={materials.graphite}
        name="project_display_housing"
      />
      <mesh ref={screenRef} position={[0, 0, 0.055]} name="project_screen_surface">
        <planeGeometry args={[0.92, 0.56]} />
        <primitive object={materials.screen} attach="material" />
      </mesh>
      <Connector
        from={[0, -0.35, 0]}
        to={[0.1, -0.74, 0.03]}
        radius={0.035}
        material={materials.brushedRail}
        name="project_module_arm"
      />
      <SoftBox
        size={[0.5, 0.07, 0.35]}
        position={[0.1, -0.76, 0.04]}
        radius={0.03}
        material={materials.darkSteel}
        name="project_module_base"
      />
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// server_module
// ────────────────────────────────────────────────────────────────────────────────

function ServerModule({
  materials,
  chapter,
}: {
  materials: WorkspaceMaterials;
  chapter: number;
}) {
  const trayRef = useRef<THREE.Group>(null);
  const bladeIndicators = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }, delta) => {
    if (trayRef.current) {
      const trayTarget = chapter >= 4 ? 0.18 : 0;
      trayRef.current.position.z = dampValue(trayRef.current.position.z, trayTarget, 4, delta);
    }

    bladeIndicators.current.forEach((indicator, index) => {
      if (!indicator) return;
      const mat = indicator.material as THREE.MeshStandardMaterial;
      const activationChapter = index + 1;
      const isActive = chapter >= activationChapter && !(index === 2 && chapter < 4);
      const pulse = Math.sin(clock.elapsedTime * 1.5 + index * 1.2) * 0.5 + 0.5;
      const targetIntensity = isActive ? 0.2 + pulse * 0.15 : 0;
      mat.emissiveIntensity = dampValue(mat.emissiveIntensity, targetIntensity, 5, delta);
    });
  });

  return (
    <group position={[-2.05, -0.22, 0.55]} name="server_module">
      <SoftBox
        size={[0.82, 0.98, 0.82]}
        radius={0.06}
        material={materials.graphite}
        name="server_chassis"
      />
      <SoftBox
        size={[0.68, 0.82, 0.03]}
        position={[0, 0, 0.42]}
        radius={0.02}
        material={materials.darkSteel}
        name="server_faceplate"
      />

      <group ref={trayRef} name="server_opening_tray">
        {[-0.24, 0, 0.24].map((y, index) => (
          <group key={y} position={[0, y, 0.44]}>
            <SoftBox
              size={[0.52, 0.09, 0.03]}
              radius={0.015}
              material={materials.warmGrey}
              name={`server_blade_${index + 1}`}
            />
            <mesh
              ref={(node) => {
                if (node) bladeIndicators.current[index] = node;
              }}
              position={[0.18, 0, 0.02]}
              name={`server_blade_indicator_${index + 1}`}
            >
              <boxGeometry args={[0.06, 0.03, 0.01]} />
              <primitive
                object={index === 1 ? materials.desaturatedOrange : materials.desaturatedCyan}
                attach="material"
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// books & notebook
// ────────────────────────────────────────────────────────────────────────────────

function Books({
  materials,
  chapter,
}: {
  materials: WorkspaceMaterials;
  chapter: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const rotTargets = [-0.14, -0.08, -0.16, -0.2, -0.1, -0.14];
    const targetRotY = rotTargets[chapter] ?? -0.14;
    groupRef.current.rotation.y = dampValue(groupRef.current.rotation.y, targetRotY, 4, delta);

    const liftTargets = [0, 0.015, 0.005, 0.02, 0.01, 0];
    groupRef.current.position.y = dampValue(
      groupRef.current.position.y,
      liftTargets[chapter] ?? 0,
      4,
      delta,
    );
  });

  return (
    <group ref={groupRef} position={[1.3, 0.22, 0.52]} rotation={[0, -0.14, 0]} name="books">
      <SoftBox
        size={[0.76, 0.09, 0.5]}
        position={[0, 0, 0]}
        radius={0.02}
        material={materials.desaturatedOrange}
        name="algorithms_volume"
      />
      <SoftBox
        size={[0.68, 0.08, 0.46]}
        position={[-0.03, 0.095, 0.01]}
        radius={0.02}
        material={materials.darkSteel}
        name="systems_volume"
      />

      <group position={[0.08, 0.16, 0.03]} name="notebook">
        <SoftBox
          size={[0.6, 0.05, 0.42]}
          radius={0.015}
          material={materials.warmGrey}
          name="notebook_cover"
        />
        <SoftBox
          size={[0.035, 0.06, 0.36]}
          position={[-0.2, 0.03, 0]}
          radius={0.006}
          material={materials.desaturatedCyan}
          name="notebook_accent_spine"
        />
      </group>
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// desk_lamp
// ────────────────────────────────────────────────────────────────────────────────

function DeskLamp({
  materials,
  chapter,
  reducedMotion,
}: {
  materials: WorkspaceMaterials;
  chapter: number;
  reducedMotion: boolean;
}) {
  const pointLightRef = useRef<THREE.PointLight>(null);
  const headRef = useRef<THREE.Group>(null);
  const emitterRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (pointLightRef.current) {
      const intensityTargets = [0, 0.6, 0.5, 0.55, 0.5, 1.0];
      const target = intensityTargets[chapter] ?? 0;
      pointLightRef.current.intensity = dampValue(
        pointLightRef.current.intensity,
        target,
        reducedMotion ? 50 : 3.5,
        delta,
      );
    }

    if (headRef.current) {
      const tiltTargets = [0.0, -0.1, -0.06, -0.14, -0.08, -0.12];
      const idle = reducedMotion
        ? 0
        : Math.sin(clock.elapsedTime * 0.25) * 0.012;
      const targetTilt = (tiltTargets[chapter] ?? 0) + idle;
      headRef.current.rotation.z = dampValue(
        headRef.current.rotation.z,
        targetTilt,
        reducedMotion ? 50 : 3,
        delta,
      );
    }

    if (emitterRef.current) {
      const mat = emitterRef.current.material as THREE.MeshStandardMaterial;
      const emissiveTargets = [0, 0.35, 0.25, 0.3, 0.28, 0.5];
      const target = emissiveTargets[chapter] ?? 0;
      mat.emissiveIntensity = dampValue(mat.emissiveIntensity, target, 4, delta);
    }
  });

  return (
    <group position={[1.85, 0.26, -0.05]} name="desk_lamp">
      <SoftBox
        size={[0.44, 0.09, 0.38]}
        radius={0.04}
        material={materials.darkSteel}
        name="lamp_base"
      />
      <Connector
        from={[0, 0.06, 0]}
        to={[0.02, 0.8, -0.1]}
        radius={0.032}
        material={materials.brushedRail}
        name="lamp_lower_arm"
      />
      <group
        ref={headRef}
        position={[0.02, 0.8, -0.1]}
        name="lamp_articulated_head"
      >
        <Connector
          from={[0, 0, 0]}
          to={[-0.22, 0.4, -0.08]}
          radius={0.028}
          material={materials.brushedRail}
          name="lamp_upper_arm"
        />
        <SoftBox
          size={[0.46, 0.18, 0.26]}
          position={[-0.28, 0.45, -0.08]}
          rotation={[0.1, 0, -0.1]}
          radius={0.06}
          material={materials.graphite}
          name="lamp_housing"
        />
        <mesh
          ref={emitterRef}
          position={[-0.28, 0.35, -0.05]}
          rotation={[0.1, 0, -0.1]}
          name="lamp_element"
        >
          <boxGeometry args={[0.32, 0.03, 0.16]} />
          <primitive object={materials.desaturatedOrange} attach="material" />
        </mesh>

        <group name="accent_lights">
          <pointLight
            ref={pointLightRef}
            position={[-0.26, 0.26, 0]}
            color="#e3a167"
            intensity={0}
            distance={3.2}
            decay={2}
            name="lamp_curiosity_light"
          />
        </group>
      </group>
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Developer Figure Pass
// ────────────────────────────────────────────────────────────────────────────────

function DeveloperFigure({
  materials,
  chapter,
  reducedMotion,
}: {
  materials: WorkspaceMaterials;
  chapter: number;
  reducedMotion: boolean;
}) {
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Mesh>(null);
  const rightHandRef = useRef<THREE.Mesh>(null);
  const pelvisRef = useRef<THREE.Group>(null);

  // States
  const isDormant = chapter === 0;
  const isTyping = chapter >= 1 && chapter <= 4;
  const isProject = chapter === 3;
  const isContact = chapter === 5;

  useFrame(({ clock }, delta) => {
    // 1. Pelvis breathing
    if (pelvisRef.current) {
      const breath = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.6) * 0.005;
      pelvisRef.current.position.y = dampValue(pelvisRef.current.position.y, 0.46 + breath, 4.0, delta);
    }

    // 2. Torso posture leaning toward keyboard
    if (torsoRef.current) {
      const leanTarget = isDormant ? 0.03 : isContact ? -0.04 : isProject ? 0.12 : 0.08;
      const sway = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.65) * 0.006;
      torsoRef.current.rotation.x = dampValue(torsoRef.current.rotation.x, leanTarget + sway, reducedMotion ? 50 : 3.0, delta);
    }

    // 3. Head pitch and yaw
    if (headRef.current) {
      const pitchTarget = isDormant ? 0.14 : isContact ? -0.02 : isProject ? -0.05 : -0.08;
      const yawTarget = isProject ? -0.22 : isContact ? 0.06 : 0;
      const headSwayX = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.4) * 0.010;
      const headSwayY = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.45) * 0.008;

      headRef.current.rotation.x = dampValue(headRef.current.rotation.x, pitchTarget + headSwayX, reducedMotion ? 50 : 3.2, delta);
      headRef.current.rotation.y = dampValue(headRef.current.rotation.y, yawTarget + headSwayY, reducedMotion ? 50 : 3.0, delta);
    }

    // 4. Typing Animation: hands tap vertically over keyboard surface
    if (leftHandRef.current && rightHandRef.current) {
      if (isTyping && !reducedMotion) {
        const cycle = clock.elapsedTime;
        const leftPhase = (cycle * 2.1) % 4.0;
        const rightPhase = (cycle * 2.0 + 1.6) % 4.0;

        const leftDown = leftPhase >= 1.2 && leftPhase < 1.6 ? 1 : 0;
        const leftTap = (leftDown ? Math.sin((Math.PI / 2) * ((leftPhase - 1.2) / 0.4)) : 0) * 0.018;

        const rightDown = rightPhase >= 1.2 && rightPhase < 1.6 ? 1 : 0;
        const rightTap = (rightDown ? Math.sin((Math.PI / 2) * ((rightPhase - 1.2) / 0.4)) : 0) * 0.016;

        leftHandRef.current.position.y = dampValue(leftHandRef.current.position.y, 0.55 + leftTap, 18, delta);
        rightHandRef.current.position.y = dampValue(rightHandRef.current.position.y, 0.55 + rightTap, 18, delta);
      } else {
        const restY = isContact ? 0.52 : isDormant ? 0.50 : 0.54;
        leftHandRef.current.position.y = dampValue(leftHandRef.current.position.y, restY, 6, delta);
        rightHandRef.current.position.y = dampValue(rightHandRef.current.position.y, restY, 6, delta);
      }
    }
  });

  return (
    <group position={[-0.25, -0.81, 0.95]} name="developer_rig_root">
      {/* Refined Ergonomic Chair */}
      <group position={[0, 0, 0]} name="developer_chair">
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} name="chair_base_foot">
          <cylinderGeometry args={[0.22, 0.24, 0.02, 12]} />
          <primitive object={materials.graphite} attach="material" />
        </mesh>
        <mesh position={[0, 0.22, 0]} name="chair_stem">
          <cylinderGeometry args={[0.025, 0.03, 0.38, 8]} />
          <primitive object={materials.brushedRail} attach="material" />
        </mesh>
        <SoftBox
          size={[0.62, 0.06, 0.58]}
          position={[0, 0.44, -0.02]}
          radius={0.03}
          material={materials.darkSteel}
          name="chair_seat"
        />
        <Connector from={[0, 0.44, 0.22]} to={[0, 0.74, 0.26]} radius={0.018} material={materials.brushedRail} />
        <SoftBox
          size={[0.54, 0.34, 0.05]}
          position={[0, 0.76, 0.27]}
          radius={0.04}
          material={materials.darkSteel}
          name="chair_backrest"
        />
      </group>

      {/* Developer Body Hierarchy */}
      <group position={[0, 0, 0]} name="developer_body">
        <group ref={pelvisRef} position={[0, 0.46, 0]} name="developer_pelvis">
          <group ref={torsoRef} position={[0, 0, 0]} name="developer_torso">
            {/* Torso Hoodie/Sweater */}
            <SoftBox size={[0.52, 0.56, 0.32]} position={[0, 0.28, 0]} radius={0.08} material={materials.darkSteel} name="torso_mesh" />
            
            {/* Neck collar */}
            <SoftBox size={[0.18, 0.08, 0.16]} position={[0, 0.58, -0.02]} radius={0.03} material={materials.darkSteel} name="neck_collar" />

            {/* Clean head in warmGrey, completely bald/flat, no cap */}
            <group ref={headRef} position={[0, 0.78, -0.04]} name="developer_head">
              <SoftBox size={[0.26, 0.28, 0.26]} position={[0, 0, 0]} radius={0.06} material={materials.warmGrey} name="head_volume" />
            </group>

            {/* ── LEFT ARM ── */}
            <group name="developer_left_arm">
              {/* Shoulder */}
              <SoftBox size={[0.13, 0.13, 0.13]} position={[-0.28, 0.52, 0]} radius={0.04} material={materials.darkSteel} name="left_shoulder" />
              {/* Upper arm going outward and down to elbow */}
              <Connector from={[-0.28, 0.52, 0]} to={[-0.32, 0.32, -0.22]} radius={0.05} material={materials.darkSteel} name="left_upper_arm" />
              {/* Elbow Joint */}
              <SoftBox size={[0.11, 0.11, 0.11]} position={[-0.32, 0.32, -0.22]} radius={0.035} material={materials.darkSteel} name="left_elbow" />
              {/* Forearm extending forward/up from elbow to keyboard wrist */}
              <Connector from={[-0.32, 0.32, -0.22]} to={[-0.12, 0.54, -0.47]} radius={0.045} material={materials.darkSteel} name="left_forearm" />
            </group>

            {/* ── RIGHT ARM ── */}
            <group name="developer_right_arm">
              {/* Shoulder */}
              <SoftBox size={[0.13, 0.13, 0.13]} position={[0.28, 0.52, 0]} radius={0.04} material={materials.darkSteel} name="right_shoulder" />
              {/* Upper arm going outward and down to elbow */}
              <Connector from={[0.28, 0.52, 0]} to={[0.32, 0.32, -0.22]} radius={0.05} material={materials.darkSteel} name="right_upper_arm" />
              {/* Elbow Joint */}
              <SoftBox size={[0.11, 0.11, 0.11]} position={[0.32, 0.32, -0.22]} radius={0.035} material={materials.darkSteel} name="right_elbow" />
              {/* Forearm extending forward/up from elbow to keyboard wrist */}
              <Connector from={[0.32, 0.32, -0.22]} to={[0.12, 0.54, -0.47]} radius={0.045} material={materials.darkSteel} name="right_forearm" />
            </group>

            {/* ── HANDS (in bright warmGrey, directly over the keyboard keys) ── */}
            <group name="developer_hands">
              <mesh ref={leftHandRef} position={[-0.12, 0.55, -0.48]} rotation={[0.08, 0.06, -0.04]} name="left_hand_mesh">
                <boxGeometry args={[0.13, 0.045, 0.14]} />
                <primitive object={materials.warmGrey} attach="material" />
              </mesh>
              <mesh ref={rightHandRef} position={[0.12, 0.55, -0.48]} rotation={[0.08, -0.06, 0.04]} name="right_hand_mesh">
                <boxGeometry args={[0.13, 0.045, 0.14]} />
                <primitive object={materials.warmGrey} attach="material" />
              </mesh>
            </group>
          </group>

          {/* Legs beneath desk */}
          <group position={[-0.16, -0.02, -0.02]} name="developer_left_leg">
            <Connector from={[0, 0, 0]} to={[0, -0.02, -0.34]} radius={0.06} material={materials.darkSteel} name="left_thigh" />
            <Connector from={[0, -0.02, -0.34]} to={[0, -0.44, -0.36]} radius={0.05} material={materials.darkSteel} name="left_shin" />
            <mesh position={[0, -0.46, -0.40]} name="left_foot_mesh">
              <boxGeometry args={[0.13, 0.04, 0.20]} />
              <primitive object={materials.darkSteel} attach="material" />
            </mesh>
          </group>
          <group position={[0.16, -0.02, -0.02]} name="developer_right_leg">
            <Connector from={[0, 0, 0]} to={[0, -0.02, -0.34]} radius={0.06} material={materials.darkSteel} name="right_thigh" />
            <Connector from={[0, -0.02, -0.34]} to={[0, -0.44, -0.36]} radius={0.05} material={materials.darkSteel} name="right_shin" />
            <mesh position={[0, -0.46, -0.40]} name="right_foot_mesh">
              <boxGeometry args={[0.13, 0.04, 0.20]} />
              <primitive object={materials.darkSteel} attach="material" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// rear_computational_frame
// ────────────────────────────────────────────────────────────────────────────────

function RearComputationalFrame({
  materials,
  chapter,
  reducedMotion,
}: {
  materials: WorkspaceMaterials;
  chapter: number;
  reducedMotion: boolean;
}) {
  const frameGroupRef = useRef<THREE.Group>(null);
  const layerRefs = useRef<THREE.Group[]>([]);
  const nodeRefs = useRef<THREE.Mesh[]>([]);
  const connectorRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }, delta) => {
    const spacingByChapter = [0.42, 0.18, 0.28, 0.22, 0.14, 0.38];
    const spacing = spacingByChapter[chapter] ?? 0.18;
    const vertSepByChapter = [0.08, 0, 0.06, 0.02, 0, 0.05];
    const vertSep = vertSepByChapter[chapter] ?? 0;

    layerRefs.current.forEach((layer, index) => {
      if (!layer) return;
      layer.position.x = dampValue(layer.position.x, (index - 1.5) * spacing, reducedMotion ? 50 : 3, delta);
      layer.position.y = dampValue(layer.position.y, Math.abs(index - 1.5) * vertSep, reducedMotion ? 50 : 3, delta);
    });

    if (frameGroupRef.current) {
      const idle = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.35) * 0.012;
      const rotTargets = [-0.16, -0.16, -0.14, -0.12, -0.1, -0.2];
      frameGroupRef.current.rotation.y = dampValue(frameGroupRef.current.rotation.y, (rotTargets[chapter] ?? -0.16) + idle, reducedMotion ? 50 : 2.5, delta);
    }

    nodeRefs.current.forEach((node, index) => {
      if (!node) return;
      const mat = node.material as THREE.MeshStandardMaterial;
      const isActive = chapter >= ([2, 1, 4][index] ?? 2);
      const pulse = Math.sin(clock.elapsedTime * 1.0 + index * 2.1) * 0.5 + 0.5;
      mat.emissiveIntensity = dampValue(mat.emissiveIntensity, isActive ? 0.12 + pulse * 0.08 : 0, 5, delta);
    });

    connectorRefs.current.forEach((conn, index) => {
      if (!conn) return;
      const mat = conn.material as THREE.MeshStandardMaterial;
      const isActive = chapter >= ([2, 3][index] ?? 2);
      mat.emissiveIntensity = dampValue(mat.emissiveIntensity, isActive ? 0.10 : 0, 4, delta);
    });
  });

  const frameMaterialsList = [materials.brushedRail, materials.desaturatedOrange, materials.warmGrey, materials.desaturatedCyan];

  return (
    <group ref={frameGroupRef} position={[1.45, 1.25, -0.85]} rotation={[0.02, -0.16, 0]} name="rear_computational_frame">
      {frameMaterialsList.map((mat, index) => {
        const width = 1.25 - index * 0.05;
        const height = 1.72 - index * 0.08;
        const barRadius = 0.02;
        const barThickness = 0.065;

        return (
          <group
            key={index}
            ref={(node) => {
              if (node) layerRefs.current[index] = node;
            }}
            position={[(index - 1.5) * 0.38, 0, 0]}
            rotation={[index % 2 === 0 ? 0.03 : -0.02, 0, (index - 1.5) * 0.04]}
            name={`frame_lattice_layer_${index + 1}`}
          >
            <SoftBox
              size={[barThickness, height, barThickness]}
              position={[-width / 2, 0, 0]}
              radius={barRadius}
              material={mat}
            />
            <SoftBox
              size={[barThickness, height, barThickness]}
              position={[width / 2, 0, 0]}
              radius={barRadius}
              material={mat}
            />
            <SoftBox
              size={[width, barThickness, barThickness]}
              position={[0, height / 2, 0]}
              radius={barRadius}
              material={mat}
            />
            <SoftBox
              size={[width, barThickness, barThickness]}
              position={[0, -height / 2, 0]}
              radius={barRadius}
              material={mat}
            />
            <SoftBox
              size={[0.18, 0.05, 0.1]}
              position={[index % 2 === 0 ? -width * 0.3 : width * 0.3, height * 0.25, 0.01]}
              radius={0.012}
              material={mat}
            />
          </group>
        );
      })}

      <group position={[0, 0, 0.06]} name="frame_internal_nodes">
        <mesh
          ref={(node) => {
            if (node) nodeRefs.current[0] = node;
          }}
          position={[0, 0.1, 0]}
          name="core_node_primary"
        >
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <primitive object={materials.desaturatedOrange} attach="material" />
        </mesh>
        <mesh
          ref={(node) => {
            if (node) nodeRefs.current[1] = node;
          }}
          position={[-0.32, 0.42, 0.02]}
          name="core_node_left"
        >
          <boxGeometry args={[0.14, 0.14, 0.14]} />
          <primitive object={materials.desaturatedCyan} attach="material" />
        </mesh>
        <mesh
          ref={(node) => {
            if (node) nodeRefs.current[2] = node;
          }}
          position={[0.3, -0.32, -0.02]}
          name="core_node_right"
        >
          <boxGeometry args={[0.14, 0.14, 0.14]} />
          <primitive object={materials.warmGrey} attach="material" />
        </mesh>
        <Connector
          from={[-0.32, 0.42, 0.02]}
          to={[0, 0.1, 0]}
          radius={0.014}
          material={materials.desaturatedCyan}
          name="node_link_left"
        />
        <Connector
          from={[0, 0.1, 0]}
          to={[0.3, -0.32, -0.02]}
          radius={0.014}
          material={materials.warmGrey}
          name="node_link_right"
        />
      </group>
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// cyan_data_paths
// ────────────────────────────────────────────────────────────────────────────────

function CyanDataPaths({
  materials,
  chapter,
  reducedMotion,
}: {
  materials: WorkspaceMaterials;
  chapter: number;
  reducedMotion: boolean;
}) {
  const tubeRefs = useRef<THREE.Mesh[]>([]);
  const pulseRefs = useRef<THREE.Mesh[]>([]);

  const cyanCurves = useMemo(
    () => [
      // Server Module → Primary Monitor
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.0, -0.1, 0.55),
        new THREE.Vector3(-1.8, -0.4, 0.1),
        new THREE.Vector3(-1.1, -0.1, -0.3),
        new THREE.Vector3(-0.62, 0.35, -0.35),
      ]),
      // Frame Lattice → Desk Surface
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.1, 1.4, -0.8),
        new THREE.Vector3(0.8, 0.6, -0.5),
        new THREE.Vector3(0.2, 0.08, 0.1),
      ]),
    ],
    [],
  );

  useFrame(({ clock }, delta) => {
    tubeRefs.current.forEach((tube, index) => {
      if (!tube) return;
      const mat = tube.material as THREE.MeshStandardMaterial;
      const activationChapter = index === 0 ? 1 : 2;
      const isActive = chapter >= activationChapter;
      const contactBoost = chapter === 5 ? 0.10 : 0;
      const target = isActive ? 0.24 + contactBoost : 0;
      mat.emissiveIntensity = dampValue(mat.emissiveIntensity, target, 4, delta);
    });

    pulseRefs.current.forEach((pulse, index) => {
      if (!pulse) return;
      const activationChapter = index === 0 ? 1 : 2;
      const isActive = chapter >= activationChapter;
      const speed = reducedMotion ? 0 : 0.08 + index * 0.012;
      const t = (clock.elapsedTime * speed + index * 0.42) % 1;
      const point = cyanCurves[index].getPointAt(t);
      pulse.position.copy(point);
      const targetScale = isActive ? 1 : 0.001;
      pulse.scale.setScalar(dampValue(pulse.scale.x, targetScale, 5, delta));
    });
  });

  return (
    <group name="cyan_data_paths">
      {cyanCurves.map((curve, index) => (
        <mesh
          key={index}
          ref={(node) => {
            if (node) tubeRefs.current[index] = node;
          }}
          name={`cyan_path_${index + 1}`}
        >
          <tubeGeometry args={[curve, 28, 0.016, 6, false]} />
          <primitive object={materials.desaturatedCyan} attach="material" />
        </mesh>
      ))}
      {cyanCurves.map((curve, index) => (
        <mesh
          key={`cyan-pulse-${index}`}
          ref={(node) => {
            if (node) pulseRefs.current[index] = node;
          }}
          position={curve.getPointAt(0)}
          name={`cyan_signal_${index + 1}`}
        >
          <boxGeometry args={[0.08, 0.04, 0.08]} />
          <primitive object={materials.desaturatedCyan} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// orange_data_paths
// ────────────────────────────────────────────────────────────────────────────────

function OrangeDataPaths({
  materials,
  chapter,
  reducedMotion,
}: {
  materials: WorkspaceMaterials;
  chapter: number;
  reducedMotion: boolean;
}) {
  const tubeRefs = useRef<THREE.Mesh[]>([]);
  const pulseRefs = useRef<THREE.Mesh[]>([]);

  const orangeCurves = useMemo(
    () => [
      // Books → Keyboard
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.3, 0.28, 0.5),
        new THREE.Vector3(0.6, 0.05, 0.52),
        new THREE.Vector3(-0.25, 0.2, 0.47),
      ]),
      // Rear Frame → Server Module
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.8, 0.8, -0.85),
        new THREE.Vector3(-0.8, 0.4, -0.2),
        new THREE.Vector3(-1.95, -0.05, 0.54),
      ]),
    ],
    [],
  );

  useFrame(({ clock }, delta) => {
    tubeRefs.current.forEach((tube, index) => {
      if (!tube) return;
      const mat = tube.material as THREE.MeshStandardMaterial;
      const activationChapter = index === 0 ? 3 : 4;
      const isActive = chapter >= activationChapter;
      const contactBoost = chapter === 5 ? 0.10 : 0;
      const target = isActive ? 0.22 + contactBoost : 0;
      mat.emissiveIntensity = dampValue(mat.emissiveIntensity, target, 4, delta);
    });

    pulseRefs.current.forEach((pulse, index) => {
      if (!pulse) return;
      const activationChapter = index === 0 ? 3 : 4;
      const isActive = chapter >= activationChapter;
      const speed = reducedMotion ? 0 : 0.07 + index * 0.01;
      const t = (clock.elapsedTime * speed + index * 0.35) % 1;
      const point = orangeCurves[index].getPointAt(t);
      pulse.position.copy(point);
      const targetScale = isActive ? 1 : 0.001;
      pulse.scale.setScalar(dampValue(pulse.scale.x, targetScale, 5, delta));
    });
  });

  return (
    <group name="orange_data_paths">
      {orangeCurves.map((curve, index) => (
        <mesh
          key={index}
          ref={(node) => {
            if (node) tubeRefs.current[index] = node;
          }}
          name={`orange_path_${index + 1}`}
        >
          <tubeGeometry args={[curve, 28, 0.016, 6, false]} />
          <primitive object={materials.desaturatedOrange} attach="material" />
        </mesh>
      ))}
      {orangeCurves.map((curve, index) => (
        <mesh
          key={`orange-pulse-${index}`}
          ref={(node) => {
            if (node) pulseRefs.current[index] = node;
          }}
          position={curve.getPointAt(0)}
          name={`orange_signal_${index + 1}`}
        >
          <boxGeometry args={[0.08, 0.04, 0.08]} />
          <primitive object={materials.desaturatedOrange} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Materials
// ────────────────────────────────────────────────────────────────────────────────

function useWorkspaceMaterials() {
  const ideTexture = useProceduralIDETexture();

  const materials = useMemo<WorkspaceMaterials>(
    () => ({
      graphite: new THREE.MeshStandardMaterial({
        color: "#1c2427",
        roughness: 0.72,
        metalness: 0.22,
        envMapIntensity: 0.5,
        name: "M_DeepGraphite",
      }),
      darkSteel: new THREE.MeshStandardMaterial({
        color: "#2b343a",
        roughness: 0.58,
        metalness: 0.34,
        envMapIntensity: 0.65,
        name: "M_DarkSteel",
      }),
      warmGrey: new THREE.MeshStandardMaterial({
        color: "#dedbd2",
        roughness: 0.7,
        metalness: 0.08,
        envMapIntensity: 0.4,
        name: "M_SoftWarmGrey",
      }),
      desaturatedOrange: new THREE.MeshStandardMaterial({
        color: "#d18a52",
        emissive: "#7a4622",
        emissiveIntensity: 0,
        roughness: 0.62,
        metalness: 0.14,
        envMapIntensity: 0.55,
        name: "M_DesaturatedOrange",
      }),
      desaturatedCyan: new THREE.MeshStandardMaterial({
        color: "#559a9d",
        emissive: "#236066",
        emissiveIntensity: 0,
        roughness: 0.56,
        metalness: 0.18,
        envMapIntensity: 0.6,
        name: "M_DesaturatedCyan",
      }),
      screen: new THREE.MeshStandardMaterial({
        color: "#d7d4ca",
        map: ideTexture,
        emissive: "#ffffff",
        emissiveMap: ideTexture,
        emissiveIntensity: 0,
        roughness: 0.4,
        metalness: 0.1,
        name: "M_PrimaryScreenIDE",
      }),
      brushedRail: new THREE.MeshStandardMaterial({
        color: "#3d464a",
        roughness: 0.52,
        metalness: 0.38,
        name: "M_BrushedRail",
      }),
    }),
    [ideTexture],
  );

  useEffect(
    () => () => {
      Object.values(materials).forEach((material) => material.dispose());
    },
    [materials],
  );

  return materials;
}

// ────────────────────────────────────────────────────────────────────────────────
// Camera rig
// ────────────────────────────────────────────────────────────────────────────────

function CameraRig({ chapter, reducedMotion }: { chapter: number; reducedMotion: boolean }) {
  const { camera, pointer, size } = useThree();

  useFrame((_, delta) => {
    const compact = size.width < 430;
    const chapterDepth = [0, 0.18, -0.12, 0.3, -0.2, 0.05][chapter] ?? 0;
    const pointerX = reducedMotion || compact ? 0 : pointer.x * 0.12;
    const pointerY = reducedMotion || compact ? 0 : pointer.y * 0.07;
    const target = new THREE.Vector3(
      (compact ? 6.25 : 6.2) + chapterDepth + pointerX,
      (compact ? 4.3 : 4.15) + pointerY,
      compact ? 8.8 : 8.65,
    );
    camera.position.lerp(target, 1 - Math.exp(-delta * 2.2));
    camera.lookAt(-0.15, 0.18, 0);
  });

  return null;
}

// ────────────────────────────────────────────────────────────────────────────────
// Ambient Particle Dust System
// ────────────────────────────────────────────────────────────────────────────────

function WorkspaceParticles() {
  const count = 45;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 5.0; // X spread
      arr[i * 3 + 1] = Math.random() * 2.5 - 0.5; // Y height
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4.0; // Z depth
    }
    return arr;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.elapsedTime;
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position;
    for (let i = 0; i < count; i++) {
      // Drifts gently upward and sways
      const y = pos.getY(i) + 0.0012;
      const x = pos.getX(i) + Math.sin(t * 0.5 + i) * 0.0008;
      pos.setY(i, y > 2.0 ? -0.5 : y);
      pos.setX(i, x);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a9c4c0"
        size={0.024}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Master model orchestrator
// ────────────────────────────────────────────────────────────────────────────────

function WorkspaceModel({ chapter, reducedMotion, onModelReady }: WorkspaceSceneProps) {
  const modelRef = useRef<THREE.Group>(null);
  const presentationRef = useRef<THREE.Group>(null);
  const materials = useWorkspaceMaterials();
  const { size, pointer } = useThree();

  useEffect(() => {
    onModelReady(modelRef.current);
    return () => onModelReady(null);
  }, [onModelReady]);

  // Global material emissive drives (boosted to read well under ACES tone mapping)
  useFrame((_, delta) => {
    const screenTargets = [0.15, 0.7, 0.8, 1.15, 0.85, 0.65];
    const screenTarget = screenTargets[chapter] ?? 0.15;
    materials.screen.emissiveIntensity = dampValue(
      materials.screen.emissiveIntensity,
      screenTarget,
      reducedMotion ? 50 : 3.5,
      delta,
    );

    const cyanTargets = [0, 0.3, 0.52, 0.38, 0.42, 0.48];
    materials.desaturatedCyan.emissiveIntensity = dampValue(
      materials.desaturatedCyan.emissiveIntensity,
      cyanTargets[chapter] ?? 0,
      3.5,
      delta,
    );

    const orangeTargets = [0, 0.08, 0.12, 0.36, 0.3, 0.44];
    materials.desaturatedOrange.emissiveIntensity = dampValue(
      materials.desaturatedOrange.emissiveIntensity,
      orangeTargets[chapter] ?? 0,
      3.5,
      delta,
    );
  });

  // Responsive presentation positioning
  useFrame((_, delta) => {
    if (!presentationRef.current) return;
    const compact = size.width < 430;
    const targetScale = compact ? 0.76 : size.width < 620 ? 0.72 : 0.84;
    const targetX = -0.34;
    const targetY = compact ? 0.3 : 0.34;
    const targetRotation =
      -0.08 + chapter * 0.018 + (reducedMotion || compact ? 0 : pointer.x * 0.025);
    presentationRef.current.scale.setScalar(
      dampValue(presentationRef.current.scale.x, targetScale, 3.5, delta),
    );
    presentationRef.current.position.x = dampValue(
      presentationRef.current.position.x,
      targetX,
      3.5,
      delta,
    );
    presentationRef.current.position.y = dampValue(
      presentationRef.current.position.y,
      targetY,
      3.5,
      delta,
    );
    presentationRef.current.rotation.y = dampValue(
      presentationRef.current.rotation.y,
      targetRotation,
      3.5,
      delta,
    );
  });

  return (
    <group ref={presentationRef} scale={0.94} position={[1.38, -0.02, 0]}>
      <group ref={modelRef} name="computational_studio">
        <WorkstationBase materials={materials} chapter={chapter} />
        <MainDesk materials={materials} />
        <PrimaryMonitor materials={materials} chapter={chapter} reducedMotion={reducedMotion} />
        <ProjectModules materials={materials} chapter={chapter} reducedMotion={reducedMotion} />
        <Keyboard materials={materials} chapter={chapter} />
        <ServerModule materials={materials} chapter={chapter} />
        <Books materials={materials} chapter={chapter} />
        <DeskLamp materials={materials} chapter={chapter} reducedMotion={reducedMotion} />
        <DeveloperFigure materials={materials} chapter={chapter} reducedMotion={reducedMotion} />
        <RearComputationalFrame
          materials={materials}
          chapter={chapter}
          reducedMotion={reducedMotion}
        />
        <CyanDataPaths materials={materials} chapter={chapter} reducedMotion={reducedMotion} />
        <OrangeDataPaths materials={materials} chapter={chapter} reducedMotion={reducedMotion} />
        <WorkspaceParticles />
      </group>
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Scene canvas
// ────────────────────────────────────────────────────────────────────────────────

export default function WorkspaceScene(props: WorkspaceSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      shadows="soft"
      performance={{ min: 0.5 }}
    >
      <PerspectiveCamera makeDefault position={[6.2, 4.15, 8.65]} fov={33} near={0.1} far={60} />
      <CameraRig chapter={props.chapter} reducedMotion={props.reducedMotion} />

      {/* Base fill lighting */}
      <ambientLight intensity={0.5} color="#afbfba" />
      <hemisphereLight args={["#a9c4c0", "#0d0f10", 0.85]} />

      {/* Key light — warm, casts soft shadows */}
      <directionalLight
        position={[4.5, 7, 5.5]}
        intensity={2.4}
        color="#f1e2ca"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-far={18}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />

      {/* Cool rim light — separates the silhouette from the dark background */}
      <directionalLight position={[-5, 3.5, -4]} intensity={0.9} color="#5b8f95" />

      {/* Soft cyan bounce from the left */}
      <pointLight position={[-4, 1, 2]} intensity={0.7} distance={8} color="#447d82" />

      {/* Procedural studio environment for realistic matte-metal reflections (no external files) */}
      <Environment resolution={128} frames={1}>
        <color attach="background" args={["#0a0d0e"]} />
        <Lightformer intensity={1.4} color="#f1e2ca" position={[4, 5, 4]} scale={[6, 6, 1]} />
        <Lightformer intensity={0.7} color="#5b8f95" position={[-5, 2, -4]} scale={[5, 5, 1]} />
        <Lightformer intensity={0.5} color="#cb834c" position={[2, 1, -5]} scale={[4, 2, 1]} />
      </Environment>

      <WorkspaceModel {...props} />

      {/* Grounded contact shadow */}
      <ContactShadows
        position={[-0.3, -1.16, 0]}
        opacity={0.42}
        scale={10}
        blur={2.6}
        far={5}
        resolution={1024}
        color="#020304"
      />
    </Canvas>
  );
}
