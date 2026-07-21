"use client";

import { useEffect, useRef } from "react";

type SignalSceneProps = {
  activeLayer: "data" | "model" | "explain" | "product";
  paused: boolean;
  quality: "high" | "balanced";
  variant: "restyled" | "simplified" | "minimal";
};

const layerOrder = ["data", "model", "explain", "product"] as const;

export default function SignalScene({ activeLayer, paused, quality, variant }: SignalSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneState = useRef<{ setLayer: (index: number) => void; setPaused: (value: boolean) => void } | null>(null);
  const initialLayer = useRef(activeLayer);
  const initialPaused = useRef(paused);

  useEffect(() => {
    sceneState.current?.setLayer(layerOrder.indexOf(activeLayer));
  }, [activeLayer]);

  useEffect(() => {
    sceneState.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let cleanup = () => {};

    void import("three").then((THREE) => {
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        const nav = navigator as Navigator & { deviceMemory?: number };
        const capable = (nav.hardwareConcurrency ?? 4) >= 6 && (nav.deviceMemory ?? 4) >= 4;
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: capable, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === "high" && capable ? 1.5 : 1.25));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMappingExposure = 0.82;
      } catch {
        window.dispatchEvent(new Event("signal-scene-unavailable"));
        canvas.dataset.available = "false";
        return;
      }

      canvas.dataset.available = "true";
      document.documentElement.dataset.webgl = "true";
      const scene = new THREE.Scene();
      const scenePalette = {
        canvas: 0x111318,
        chalk: 0xf1eee6,
        amber: 0xe0a21a,
        violet: 0x8566c7,
        success: 0x68b88e,
        hairline: 0x4a4d57,
      } as const;
      scene.add(new THREE.AmbientLight(scenePalette.chalk, 0.72));
      const keyLight = new THREE.DirectionalLight(scenePalette.amber, 1.05);
      keyLight.position.set(3.5, 4.5, 6);
      scene.add(keyLight);
      const signalFill = new THREE.PointLight(scenePalette.violet, 0.24, 14);
      signalFill.position.set(-4, -2, 5);
      scene.add(signalFill);
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 0.4, 8.4);

      const group = new THREE.Group();
      group.rotation.set(variant === "minimal" ? -0.18 : -0.78, variant === "minimal" ? 0.22 : 0.08, variant === "minimal" ? 0.12 : -0.42);
      scene.add(group);

      const amber = new THREE.Color(scenePalette.amber);
      const violet = new THREE.Color(scenePalette.violet);
      const muted = new THREE.Color(scenePalette.hairline);
      const layers: Array<{ plane: InstanceType<typeof THREE.Mesh>; edge: InstanceType<typeof THREE.LineSegments>; material: InstanceType<typeof THREE.MeshBasicMaterial> }> = [];

      for (let index = 0; index < 4; index += 1) {
        const size = 3.95 - index * 0.32;
        const geometry = new THREE.PlaneGeometry(size, size, 1, 1);
        const material = new THREE.MeshBasicMaterial({
          color: index === 2 ? amber : violet,
          transparent: true,
          opacity: index === 2 ? 0.13 : 0.045,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.z = (index - 1.5) * 0.62;
        plane.rotation.z = index * 0.11;

        const edges = new THREE.EdgesGeometry(geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({ color: index === 2 ? amber : muted, transparent: true, opacity: index === 2 ? 0.95 : 0.58 });
        const edge = new THREE.LineSegments(edges, edgeMaterial);
        plane.add(edge);
        group.add(plane);
        layers.push({ plane, edge, material });
      }

      const aperture = new THREE.Mesh(
        new THREE.TorusGeometry(0.42, 0.075, 12, 48),
        new THREE.MeshBasicMaterial({ color: amber }),
      );
      aperture.position.z = 1.35;
      group.add(aperture);

      const axisMaterial = new THREE.LineBasicMaterial({ color: amber, transparent: true, opacity: 0.36 });
      const axisGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-3.2, 0, 0), new THREE.Vector3(3.2, 0, 0),
        new THREE.Vector3(0, -3.2, 0), new THREE.Vector3(0, 3.2, 0),
      ]);
      const axes = new THREE.LineSegments(axisGeometry, axisMaterial);
      axes.position.z = 1.1;
      group.add(axes);

      const kernelMaterial = new THREE.MeshBasicMaterial({
        color: 0xf1eee6,
        transparent: true,
        opacity: 0.34,
        wireframe: false,
      });
      const kernel = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.74, quality === "high" ? 2 : 1),
        kernelMaterial,
      );
      kernel.position.z = 1.48;
      group.add(kernel);

      const kernelWire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.78, quality === "high" ? 2 : 1),
        new THREE.MeshBasicMaterial({ color: amber, wireframe: true, transparent: true, opacity: 0.62 }),
      );
      kernelWire.position.copy(kernel.position);
      group.add(kernelWire);

      const rings = [1.04, 1.38].map((radius, index) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(radius, index === 0 ? 0.025 : 0.014, 8, quality === "high" ? 72 : 40),
          new THREE.MeshBasicMaterial({ color: index === 0 ? amber : violet, transparent: true, opacity: 0.72 }),
        );
        ring.position.z = 1.46;
        ring.rotation.set(index ? 0.72 : 0.18, index ? 0.42 : -0.32, index * 0.5);
        group.add(ring);
        return ring;
      });

      const nodeCount = quality === "high" ? 10 : 6;
      const signalNodes: Array<InstanceType<typeof THREE.Mesh>> = [];
      const pathPoints: Array<InstanceType<typeof THREE.Vector3>> = [];
      for (let index = 0; index < nodeCount; index += 1) {
        const angle = (index / nodeCount) * Math.PI * 2 - Math.PI * 0.35;
        const radius = 1.72 + (index % 3) * 0.28;
        const point = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.72, 1.08 + (index % 2) * 0.44);
        const node = new THREE.Mesh(
          new THREE.SphereGeometry(index % 3 === 0 ? 0.105 : 0.065, 10, 8),
          new THREE.MeshBasicMaterial({ color: index % 3 === 0 ? amber : 0xf1eee6, transparent: true, opacity: 0.14 }),
        );
        node.position.copy(point);
        group.add(node);
        signalNodes.push(node);
        pathPoints.push(kernel.position.clone(), point);
      }
      const signalPaths = new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(pathPoints),
        new THREE.LineBasicMaterial({ color: amber, transparent: true, opacity: 0.12 }),
      );
      group.add(signalPaths);

      const projectModules = new THREE.Group();
      const projectGeometries = [new THREE.TorusGeometry(1.12, 0.16, 8, 48), new THREE.BoxGeometry(1.8, 1.8, 0.18), new THREE.OctahedronGeometry(1.1, 0)];
      projectGeometries.forEach((geometry, index) => {
        const projectModule = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: index === 1 ? 0x70c997 : index === 2 ? 0xf1eee6 : 0xf2a614, wireframe: true, transparent: true, opacity: 0.86 }));
        projectModule.position.z = 1.5;
        projectModule.scale.setScalar(0.001);
        projectModules.add(projectModule);
      });
      group.add(projectModules);

      const transmission = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 4.2, 8),
        new THREE.MeshBasicMaterial({ color: amber, transparent: true, opacity: 0.68 }),
      );
      transmission.rotation.z = Math.PI / 2;
      transmission.position.set(2.3, 0, 1.5);
      transmission.scale.y = 0.001;
      group.add(transmission);

      const specimen = new THREE.Group();
      specimen.position.z = 1.5;
      specimen.rotation.z = Math.PI / 4;
      const vaneGeometry = new THREE.BoxGeometry(1.22, 0.34, 0.12);
      const vanePositions = [
        [0, 0.78, 0], [0.78, 0, Math.PI / 2], [0, -0.78, 0], [-0.78, 0, Math.PI / 2],
      ] as const;
      vanePositions.forEach(([x, y, rotation]) => {
        const vane = new THREE.Mesh(
          vaneGeometry,
          new THREE.MeshStandardMaterial({ color: scenePalette.chalk, roughness: 0.96, metalness: 0, transparent: true, opacity: 0.48 }),
        );
        vane.position.set(x, y, 0);
        vane.rotation.z = rotation;
        vane.userData.baseX = x;
        vane.userData.baseY = y;
        const vaneEdge = new THREE.LineSegments(
          new THREE.EdgesGeometry(vaneGeometry),
          new THREE.LineBasicMaterial({ color: scenePalette.hairline, transparent: true, opacity: 0.72 }),
        );
        vane.add(vaneEdge);
        specimen.add(vane);
      });
      const specimenKernel = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.43, 0),
        new THREE.MeshStandardMaterial({ color: scenePalette.chalk, roughness: 0.9, metalness: 0, transparent: true, opacity: 0.72 }),
      );
      specimen.add(specimenKernel);
      const specimenSlit = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.035, 0.18),
        new THREE.MeshBasicMaterial({ color: scenePalette.amber, transparent: true, opacity: 0.9 }),
      );
      specimenSlit.position.z = 0.5;
      specimen.add(specimenSlit);
      const specimenTrace = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.28, -1.02, 0.12), new THREE.Vector3(1.28, 1.02, 0.12)]),
        new THREE.LineBasicMaterial({ color: scenePalette.violet, transparent: true, opacity: 0.32 }),
      );
      specimen.add(specimenTrace);
      group.add(specimen);

      layers.forEach(({ plane, edge }) => { plane.visible = variant !== "minimal"; edge.visible = variant !== "minimal"; });
      aperture.visible = variant !== "minimal";
      axes.visible = variant === "restyled";
      kernel.visible = variant !== "minimal";
      kernelWire.visible = variant !== "minimal";
      rings.forEach((ring, index) => { ring.visible = variant === "restyled" || (variant === "simplified" && index === 0); });
      signalNodes.forEach((node) => { node.visible = variant === "restyled"; });
      signalPaths.visible = variant === "restyled";
      projectModules.visible = variant === "restyled";
      transmission.visible = variant !== "simplified";
      specimen.visible = variant === "minimal";

      let width = 0;
      let height = 0;
      let activeIndex = layerOrder.indexOf(initialLayer.current);
      let chapterIndex = 0;
      let projectIndex = 0;
      let scrollProgress = 0;
      let announcedReady = false;
      const cameraTarget = new THREE.Vector3(0, 0.4, 8.4);
      let isPaused = initialPaused.current;
      let frame = 0;
      let remainingFrames = 0;
      const target = variant === "minimal" ? { x: -0.18, y: 0.22, z: 0.12 } : { x: -0.78, y: 0.08, z: -0.42 };

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height || (rect.width === width && rect.height === height)) return;
        width = rect.width;
        height = rect.height;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        remainingFrames = Math.max(remainingFrames, 2);
        requestRender();
      };

      const render = () => {
        frame = 0;
        if (isPaused || disposed) return;
        resize();

        group.rotation.x += (target.x - group.rotation.x) * 0.12;
        group.rotation.y += (target.y - group.rotation.y) * 0.12;
        group.rotation.z += (target.z - group.rotation.z) * 0.12;
        camera.position.lerp(cameraTarget, 0.075);
        camera.lookAt(0, 0, 0.8);
        group.position.y += ((scrollProgress - 0.5) * 0.22 - group.position.y) * 0.08;


        layers.forEach((layer, index) => {
          const isActive = index === activeIndex;
          const separation = chapterIndex === 5 ? 0.08 : chapterIndex === 3 ? 0.78 : 0.62;
          const targetZ = (index - 1.5) * separation + (isActive && chapterIndex !== 5 ? 0.28 : 0);
          layer.plane.position.z += (targetZ - layer.plane.position.z) * 0.14;
          layer.material.opacity += ((isActive ? 0.15 : 0.045) - layer.material.opacity) * 0.14;
          const edgeMaterial = layer.edge.material as InstanceType<typeof THREE.LineBasicMaterial>;
          edgeMaterial.opacity += ((isActive ? 0.98 : 0.5) - edgeMaterial.opacity) * 0.14;
          edgeMaterial.color.lerp(isActive ? amber : muted, 0.14);
        });
        const integrated = chapterIndex >= 4;
        if (variant === "restyled") {
          kernel.rotation.x += 0.002;
          kernel.rotation.y += 0.003;
        }
        kernelWire.rotation.copy(kernel.rotation);
        kernelMaterial.opacity += ((chapterIndex === 0 ? 0.34 : integrated ? 0.74 : 0.56) - kernelMaterial.opacity) * 0.1;
        const coreScale = chapterIndex === 0 ? 0.72 : integrated ? 1.12 : 1;
        kernel.scale.lerp(new THREE.Vector3(coreScale, coreScale, coreScale), 0.1);
        kernelWire.scale.copy(kernel.scale);

        rings.forEach((ring, index) => {
          if (variant === "restyled") ring.rotation.z += (index ? -0.002 : 0.003);
          const ringScale = chapterIndex === 5 ? 1.42 + index * 0.16 : chapterIndex === 3 ? 1.12 : chapterIndex === 0 ? 0.72 : 1;
          ring.scale.lerp(new THREE.Vector3(ringScale, ringScale, ringScale), 0.1);
        });

        signalNodes.forEach((node, index) => {
          const material = node.material as InstanceType<typeof THREE.MeshBasicMaterial>;
          const acquired = chapterIndex > 1 || (chapterIndex === 1 && index <= activeIndex * 2 + 1);
          material.opacity += ((acquired ? 0.9 : chapterIndex === 0 ? 0.06 : 0.18) - material.opacity) * 0.12;
          node.scale.setScalar(acquired ? 1 : 0.7);
        });
        const pathMaterial = signalPaths.material as InstanceType<typeof THREE.LineBasicMaterial>;
        pathMaterial.opacity += ((chapterIndex >= 1 ? integrated ? 0.62 : 0.34 : 0.08) - pathMaterial.opacity) * 0.1;

        projectModules.children.forEach((projectModule, index) => {
          const visible = chapterIndex === 3 && index === projectIndex;
          const scale = visible ? 1 : 0.001;
          projectModule.scale.lerp(new THREE.Vector3(scale, scale, scale), visible ? 0.14 : 0.2);
          projectModule.rotation.y += visible ? 0.015 : 0;
        });
        transmission.scale.y += ((chapterIndex === 5 ? 1 : 0.001) - transmission.scale.y) * 0.12;
        const specimenSpread = chapterIndex === 0 ? 0.76 : chapterIndex === 3 ? 1.12 : chapterIndex === 5 ? 1.24 : 0.94;
        specimen.children.slice(0, 4).forEach((part) => {
          const vane = part as InstanceType<typeof THREE.Mesh>;
          vane.position.x += (Number(vane.userData.baseX) * specimenSpread - vane.position.x) * 0.1;
          vane.position.y += (Number(vane.userData.baseY) * specimenSpread - vane.position.y) * 0.1;
        });
        const specimenCoreScale = chapterIndex === 0 ? 0.62 : chapterIndex >= 4 ? 1.08 : 0.9;
        specimenKernel.scale.lerp(new THREE.Vector3(specimenCoreScale, specimenCoreScale, specimenCoreScale), 0.1);
        specimenSlit.scale.x += ((0.56 + activeIndex * 0.16) - specimenSlit.scale.x) * 0.12;
        specimenTrace.visible = chapterIndex >= 1;



        if (variant === "restyled") aperture.rotation.z += 0.004;
        renderer.render(scene, camera);
        if (!announcedReady) {
          announcedReady = true;
          window.dispatchEvent(new Event("signal-scene-ready"));
        }
        remainingFrames -= 1;
        if (remainingFrames > 0) frame = requestAnimationFrame(render);
      };

      function requestRender(frames = 34) {
        remainingFrames = Math.max(remainingFrames, frames);
        if (!frame && !isPaused) frame = requestAnimationFrame(render);
      }

      const onPointer = (event: Event) => {
        const detail = (event as CustomEvent<{ x: number; y: number }>).detail;
        target.y = variant === "minimal" ? 0.22 + detail.x * 0.08 : detail.x * 0.24;
        target.x = (variant === "minimal" ? -0.18 : -0.78) + detail.y * (variant === "minimal" ? 0.06 : 0.16);
        requestRender(42);
      };

      const onLayer = (event: Event) => {
        activeIndex = (event as CustomEvent<{ index: number }>).detail.index;
        requestRender(48);
      };

      const onReset = () => {
        target.x = variant === "minimal" ? -0.18 : -0.78;
        target.y = variant === "minimal" ? 0.22 : 0.08;
        target.z = variant === "minimal" ? 0.12 : -0.42;
        requestRender(36);
      };

      const onProject = (event: Event) => {
        const id = (event as CustomEvent<{ id: string }>).detail.id;
        projectIndex = id === "fraud-detection" ? 0 : id === "weapon-detection" ? 1 : 2;
        const projectState = variant === "minimal"
          ? id === "fraud-detection" ? { layer: 2, rotation: [-0.2, 0.14, 0.08] }
            : id === "weapon-detection" ? { layer: 1, rotation: [-0.12, 0.3, 0.18] }
            : { layer: 3, rotation: [-0.08, 0.12, -0.04] }
          : id === "fraud-detection" ? { layer: 2, rotation: [-0.92, -0.14, -0.5] }
            : id === "weapon-detection" ? { layer: 1, rotation: [-0.58, 0.42, 0.18] } : { layer: 3, rotation: [-0.32, -0.24, -0.08] };
        activeIndex = projectState.layer;
        [target.x, target.y, target.z] = projectState.rotation;
        requestRender(58);
      };

      const onChapter = (event: Event) => {
        chapterIndex = (event as CustomEvent<{ index: number }>).detail.index;
        const chapterRotations = variant === "minimal"
          ? [
              [-0.18, 0.22, 0.12], [-0.12, 0.12, 0.06], [-0.2, 0.3, 0.12],
              [-0.08, 0.16, -0.04], [-0.14, 0.22, 0.08], [-0.04, 0.08, 0],
            ]
          : [
              [-0.78, 0.08, -0.42], [-0.48, -0.16, -0.18], [-0.68, 0.28, 0.12],
              [-0.9, -0.12, -0.52], [-0.36, 0.18, -0.08], [-0.12, 0, 0],
            ];
        const rotation = chapterRotations[chapterIndex] ?? chapterRotations[0];
        [target.x, target.y, target.z] = rotation;
        activeIndex = Math.min(3, Math.max(0, chapterIndex - 1));
        const cameraStates = variant === "minimal"
          ? [
              [0, 0.35, 9.1], [-0.35, 0.25, 8.8], [0.25, 0.25, 8.65],
              [0, 0.38, 8.5], [-0.2, 0.25, 8.9], [0, 0.3, 8.55],
            ]
          : [
              [0, 0.4, 8.4], [-0.7, 0.2, 7.8], [0.55, 0.15, 7.35],
              [0.1, 0.55, 6.9], [-0.45, 0.25, 7.65], [0, 0.35, 7.15],
            ];
        const cameraState = cameraStates[chapterIndex] ?? cameraStates[0];
        cameraTarget.set(cameraState[0], cameraState[1], cameraState[2]);

        requestRender(58);
      };
      const onProgress = (event: Event) => {
        scrollProgress = (event as CustomEvent<{ progress: number }>).detail.progress;
        requestRender(18);
      };


      const observer = new ResizeObserver(() => {
        resize();
        requestRender(4);
      });
      observer.observe(canvas);
      window.addEventListener("signal-pointer", onPointer);
      window.addEventListener("signal-pointer-reset", onReset);
      window.addEventListener("signal-layer", onLayer);
      window.addEventListener("signal-project", onProject);
      window.addEventListener("signal-chapter", onChapter);

      window.addEventListener("signal-progress", onProgress);
      sceneState.current = {
        setLayer(index) {
          activeIndex = index;
          requestRender(48);
        },
        setPaused(value) {
          isPaused = value;
          if (!value) requestRender(8);
          else if (frame) cancelAnimationFrame(frame);
        },
      };

      resize();
      requestRender(60);

      cleanup = () => {
        sceneState.current = null;
        observer.disconnect();
        window.removeEventListener("signal-pointer", onPointer);
        window.removeEventListener("signal-pointer-reset", onReset);
        window.removeEventListener("signal-layer", onLayer);
        window.removeEventListener("signal-project", onProject);
        window.removeEventListener("signal-chapter", onChapter);
        window.removeEventListener("signal-progress", onProgress);
        if (frame) cancelAnimationFrame(frame);
        group.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Line) {
            object.geometry?.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        renderer.dispose();
        delete document.documentElement.dataset.webgl;
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [quality, variant]);

  return <canvas ref={canvasRef} className="signal-canvas" aria-hidden="true" />;
}
