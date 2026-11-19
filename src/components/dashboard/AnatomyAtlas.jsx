import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move3d,
  Layers,
  Activity,
  Compass,
  Play,
  Pause,
  Maximize2,
  Sparkles,
} from "lucide-react";
import { bodyNodes, conditionGroups } from "@/lib/data/clinical";

const NODE_POSITIONS_3D = {
  "01": new THREE.Vector3(0, 1.48, 0.16),    // Head / Neuro
  "02": new THREE.Vector3(0.14, 0.74, 0.18),  // Chest / Cardiac
  "03": new THREE.Vector3(-0.04, 0.02, 0.18), // Abdomen / Digestive
  "04": new THREE.Vector3(-0.24, -0.88, 0.16),// Lower limb / Musculoskeletal
};

// Procedural anatomical muscle body model builder
function createHumanAnatomyModel(materials) {
  const root = new THREE.Group();
  const textureLoader = new THREE.TextureLoader();

  // Load High-Fidelity Anatomical Muscle Textures
  const frontTexture = textureLoader.load("/muscle_body.png");
  if (frontTexture) frontTexture.colorSpace = THREE.SRGBColorSpace;

  const backTexture = textureLoader.load("/muscle_body_back.png");
  if (backTexture) backTexture.colorSpace = THREE.SRGBColorSpace;

  // Front Muscular Anatomical Material
  const frontMaterial = new THREE.MeshStandardMaterial({
    map: frontTexture,
    transparent: true,
    alphaTest: 0.05,
    roughness: 0.36,
    metalness: 0.05,
    side: THREE.FrontSide,
  });

  // Back Muscular Material
  const backMaterial = new THREE.MeshStandardMaterial({
    map: backTexture,
    transparent: true,
    alphaTest: 0.05,
    roughness: 0.42,
    metalness: 0.05,
    side: THREE.BackSide,
  });

  // 1. Pedestal / Base Ring
  const ringGeo = new THREE.RingGeometry(0.85, 0.94, 48);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x087f5b, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -1.95;
  root.add(ring);

  const innerDiskGeo = new THREE.CircleGeometry(0.82, 32);
  const innerDiskMat = new THREE.MeshBasicMaterial({ color: 0x087f5b, side: THREE.DoubleSide, transparent: true, opacity: 0.08 });
  const disk = new THREE.Mesh(innerDiskGeo, innerDiskMat);
  disk.rotation.x = -Math.PI / 2;
  disk.position.y = -1.95;
  root.add(disk);

  // 2. Curved 3D Anatomical Front Muscle Mesh
  const geo = new THREE.PlaneGeometry(1.92, 3.84, 32, 48);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const radiusProfile = Math.max(0, 1 - Math.abs(x) / 0.96);
    let curveZ = Math.sin(radiusProfile * Math.PI * 0.5) * 0.12;
    if (y > 0.4 && y < 1.0) {
      curveZ += 0.04 * (1 - Math.abs(y - 0.7) / 0.3);
    } else if (y > 1.2) {
      curveZ += 0.03 * (1 - Math.abs(y - 1.5) / 0.3);
    }
    pos.setZ(i, curveZ);
  }
  geo.computeVertexNormals();

  const frontMesh = new THREE.Mesh(geo, frontMaterial);
  frontMesh.position.set(0, 0, 0.03);
  root.add(frontMesh);

  // 3. Curved 3D Anatomical Back Muscle Mesh
  const backGeo = geo.clone();
  const backPos = backGeo.attributes.position;
  for (let i = 0; i < backPos.count; i++) {
    const currentZ = backPos.getZ(i);
    backPos.setZ(i, -currentZ - 0.05);
  }
  backGeo.computeVertexNormals();

  const backMesh = new THREE.Mesh(backGeo, backMaterial);
  backMesh.position.set(0, 0, -0.03);
  root.add(backMesh);

  // 4. Volumetric Core Meshes
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x933c36,
    roughness: 0.5,
    metalness: 0.05,
    transparent: true,
    opacity: 0.85,
  });

  const torsoVolume = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.30, 1.1, 16), coreMat);
  torsoVolume.scale.set(1.15, 1.0, 0.42);
  torsoVolume.position.set(0, 0.45, -0.01);
  root.add(torsoVolume);

  const headVolume = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), coreMat);
  headVolume.scale.set(0.85, 1.05, 0.75);
  headVolume.position.set(0, 1.48, -0.01);
  root.add(headVolume);

  // 5. Pulsing Heart Organ
  const heartGeo = new THREE.SphereGeometry(0.10, 16, 16);
  const heart = new THREE.Mesh(heartGeo, materials.cardiac || new THREE.MeshStandardMaterial({ color: 0xE11D48, emissive: 0xBE123C, emissiveIntensity: 0.95 }));
  heart.scale.set(0.9, 1.15, 0.85);
  heart.position.set(0.13, 0.74, 0.04);
  heart.name = "heartOrgan";
  root.add(heart);

  // Inner Neuro Brain
  const brainGeo = new THREE.SphereGeometry(0.12, 14, 14);
  const brain = new THREE.Mesh(brainGeo, materials.neuro || new THREE.MeshStandardMaterial({ color: 0x0284C7, emissive: 0x0369A1, emissiveIntensity: 0.75 }));
  brain.position.set(0, 1.50, 0.02);
  root.add(brain);

  return root;
}

export default function AnatomyAtlas({ activeNode, onSelectNode, compact = false, linkTag }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const modelGroupRef = useRef(null);
  const animFrameRef = useRef(null);
  const pointerDrag = useRef({ dragging: false, lastX: 0, lastY: 0 });

  // State
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState("holo"); // 'holo' | 'clinical' | 'xray'
  const [autoRotate, setAutoRotate] = useState(false);
  const [hoverNode, setHoverNode] = useState(null);
  const [projectedPins, setProjectedPins] = useState({});

  const node = bodyNodes.find((n) => n.id === activeNode) || bodyNodes[0];
  const hoveredNodeData = bodyNodes.find((n) => n.id === hoverNode);
  const caption = conditionGroups[(hoveredNodeData || node).group].label;

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.2);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(3, 4, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x087f5b, 0.9);
    dirLight2.position.set(-3, -2, -3);
    scene.add(dirLight2);

    const rimLight = new THREE.PointLight(0xd6f57b, 2.5, 8);
    rimLight.position.set(0, 2.2, -2.5);
    scene.add(rimLight);

    // Materials generator
    const getMaterials = (mode) => {
      if (mode === "clinical") {
        return {
          body: new THREE.MeshStandardMaterial({
            color: 0xebf3ef,
            roughness: 0.35,
            metalness: 0.1,
            transparent: true,
            opacity: 0.88,
          }),
          skeleton: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 }),
          neuro: new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.2, emissive: 0x0284c7, emissiveIntensity: 0.5 }),
          cardiac: new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.3, emissive: 0xbe123c, emissiveIntensity: 0.6 }),
          digestive: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, emissive: 0xd97706, emissiveIntensity: 0.4 }),
          musculo: new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, emissive: 0x059669, emissiveIntensity: 0.5 }),
          internal: new THREE.MeshStandardMaterial({ color: 0x087f5b, transparent: true, opacity: 0.4 }),
        };
      } else if (mode === "xray") {
        return {
          body: new THREE.MeshBasicMaterial({
            color: 0x087f5b,
            wireframe: true,
            transparent: true,
            opacity: 0.25,
          }),
          skeleton: new THREE.MeshStandardMaterial({ color: 0xd6f57b, emissive: 0x087f5b, emissiveIntensity: 0.6 }),
          neuro: new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 }),
          cardiac: new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.9 }),
          digestive: new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.8 }),
          musculo: new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x10b981, emissiveIntensity: 0.8 }),
          internal: new THREE.MeshBasicMaterial({ color: 0x0f766e, wireframe: true, transparent: true, opacity: 0.4 }),
        };
      }
      // Default: 'holo'
      return {
        body: new THREE.MeshPhysicalMaterial({
          color: 0x075e47,
          roughness: 0.22,
          metalness: 0.1,
          transmission: 0.65,
          ior: 1.4,
          thickness: 0.5,
          transparent: true,
          opacity: 0.72,
          emissive: 0x087f5b,
          emissiveIntensity: 0.15,
        }),
        skeleton: new THREE.MeshStandardMaterial({ color: 0xa7f3d0, roughness: 0.5, emissive: 0x087f5b, emissiveIntensity: 0.25 }),
        neuro: new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.7 }),
        cardiac: new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.8 }),
        digestive: new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.6 }),
        musculo: new THREE.MeshStandardMaterial({ color: 0xd6f57b, emissive: 0x087f5b, emissiveIntensity: 0.7 }),
        internal: new THREE.MeshStandardMaterial({ color: 0x0d9488, transparent: true, opacity: 0.45 }),
      };
    };

    // Build Model
    const modelMaterials = getMaterials(viewMode);
    const modelGroup = createHumanAnatomyModel(modelMaterials);
    modelGroup.position.y = 0.1;
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Pulsing heart animation
      const heart = modelGroup.getObjectByName("heartOrgan");
      if (heart) {
        const pulse = 1 + Math.sin(time * 5.2) * 0.08 + Math.sin(time * 10.4) * 0.04;
        heart.scale.set(pulse * 0.9, pulse * 1.15, pulse * 0.85);
      }

      // Auto rotation
      if (autoRotate && !pointerDrag.current.dragging) {
        setRotation((prev) => {
          const nextY = (prev.y + 0.4) % 360;
          return { ...prev, y: nextY };
        });
      }

      // Update 2D Project Pin Coordinates
      if (container && camera) {
        const nextPins = {};
        const tempVec = new THREE.Vector3();
        const halfW = container.clientWidth / 2;
        const halfH = container.clientHeight / 2;

        Object.entries(NODE_POSITIONS_3D).forEach(([id, localVec]) => {
          tempVec.copy(localVec);
          modelGroup.localToWorld(tempVec);
          tempVec.project(camera);

          // Check if facing front (z < 1)
          const isFront = tempVec.z < 1;
          const x = tempVec.x * halfW + halfW;
          const y = -(tempVec.y * halfH) + halfH;

          nextPins[id] = { x, y, visible: isFront };
        });
        setProjectedPins(nextPins);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [viewMode]);

  // Sync Camera Zoom and Model Rotation
  useEffect(() => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.y = THREE.MathUtils.degToRad(rotation.y);
      modelGroupRef.current.rotation.x = THREE.MathUtils.degToRad(rotation.x);
    }
  }, [rotation]);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = 5.2 / zoom;
    }
  }, [zoom]);

  // Pointer Drag Handlers
  const handlePointerDown = (e) => {
    pointerDrag.current = {
      dragging: true,
      lastX: e.clientX,
      lastY: e.clientY,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!pointerDrag.current.dragging) return;
    const dx = e.clientX - pointerDrag.current.lastX;
    const dy = e.clientY - pointerDrag.current.lastY;

    pointerDrag.current.lastX = e.clientX;
    pointerDrag.current.lastY = e.clientY;

    setRotation((prev) => ({
      x: Math.max(-30, Math.min(30, prev.x + dy * 0.35)),
      y: (prev.y + dx * 0.5) % 360,
    }));
  };

  const handlePointerUp = () => {
    pointerDrag.current.dragging = false;
  };

  // Preset Views
  const setPresetView = (type) => {
    if (type === "front") setRotation({ x: 0, y: 0 });
    else if (type === "profile") setRotation({ x: 0, y: 75 });
    else if (type === "back") setRotation({ x: 0, y: 180 });
  };

  return (
    <section className="relative flex flex-col overflow-hidden rounded-3xl border border-brand-line2 bg-brand-canvas shadow-sm">
      {/* Top Header & System Indicator */}
      <div className="z-10 flex items-start justify-between px-3.5 pt-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-forest" />
            <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-brand-subtle">
              3D Anatomy Atlas
            </p>
          </div>
          <p className="mt-0.5 font-heading text-[12.5px] font-bold text-brand-ink">
            {caption}
          </p>
        </div>

        {/* View Mode & Preset Badges */}
        <div className="flex items-center gap-1.5">
          <div className="inline-flex rounded-full border border-brand-ink/10 bg-card/85 p-0.5 text-[9px]">
            <button
              type="button"
              onClick={() => setPresetView("front")}
              className={`rounded-full px-2 py-0.5 font-semibold transition-colors ${
                Math.abs(rotation.y % 360) < 25 ? "bg-brand text-white shadow-xs" : "text-brand-subtle hover:text-brand-ink"
              }`}
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setPresetView("profile")}
              className={`rounded-full px-2 py-0.5 font-semibold transition-colors ${
                Math.abs(rotation.y % 360 - 75) < 30 ? "bg-brand text-white shadow-xs" : "text-brand-subtle hover:text-brand-ink"
              }`}
            >
              Lateral
            </button>
            <button
              type="button"
              onClick={() => setPresetView("back")}
              className={`rounded-full px-2 py-0.5 font-semibold transition-colors ${
                Math.abs(rotation.y % 360 - 180) < 35 ? "bg-brand text-white shadow-xs" : "text-brand-subtle hover:text-brand-ink"
              }`}
            >
              Posterior
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive 3D Viewport */}
      <div
        className="relative flex-1 touch-none select-none overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ minHeight: compact ? "280px" : "360px" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Ambient Radial Glow */}
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-lime/20 blur-3xl"
          aria-hidden="true"
        />

        {/* WebGL Three.js Container */}
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />

        {/* 3D-Projected Hotspot Badges (Nodes 01, 02, 03, 04) */}
        {bodyNodes.map((n) => {
          const pin = projectedPins[n.id];
          if (!pin || !pin.visible) return null;

          const active = n.id === activeNode;
          const isHovered = n.id === hoverNode;
          const groupMeta = conditionGroups[n.group];

          return (
            <div
              key={n.id}
              style={{
                position: "absolute",
                left: `${pin.x}px`,
                top: `${pin.y}px`,
                transform: "translate(-50%, -50%)",
                zIndex: active ? 25 : 15,
              }}
              className="pointer-events-auto"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(n.id);
                }}
                onMouseEnter={() => setHoverNode(n.id)}
                onMouseLeave={() => setHoverNode(null)}
                aria-label={`Region ${n.id} — ${groupMeta?.label}`}
                aria-pressed={active}
                className={`group relative flex items-center justify-center rounded-full border transition-all duration-300 ${
                  active
                    ? "h-8 w-8 border-brand-carbon/30 bg-brand-lime text-brand-carbon shadow-[0_6px_20px_rgba(7,94,71,0.35)] scale-110"
                    : "h-6 w-6 border-brand-ink/15 bg-card/90 text-brand-ink backdrop-blur-xs hover:scale-105 hover:bg-card"
                }`}
              >
                {/* Ping wave for active node */}
                {active && (
                  <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-brand-lime/45" />
                )}

                <span className="text-[10px] font-extrabold">{n.id}</span>

                {/* Floating Tooltip */}
                {(isHovered || active) && (
                  <div className="pointer-events-none absolute left-full ml-2 flex flex-col whitespace-nowrap rounded-lg border border-border bg-brand-carbon px-2 py-1 text-left text-white shadow-lg backdrop-blur-md">
                    <span className="text-[8.5px] font-bold uppercase tracking-wider text-brand-lime">
                      {groupMeta?.label}
                    </span>
                    <span className="text-[9.5px] text-zinc-300">{groupMeta?.meta}</span>
                  </div>
                )}
              </button>
            </div>
          );
        })}

        {/* Dynamic Connector Line to LinkTag */}
        {linkTag && projectedPins[activeNode]?.visible && (
          <div className="pointer-events-none absolute inset-0 z-20">
            <svg className="h-full w-full overflow-visible">
              <line
                x1={projectedPins[activeNode].x}
                y1={projectedPins[activeNode].y}
                x2="100%"
                y2={projectedPins[activeNode].y}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="text-brand-carbon/30"
              />
            </svg>
            <span
              className="absolute right-0 -translate-y-1/2 rounded-l-full bg-brand-lime px-2 py-0.5 text-[9px] font-bold text-brand-carbon shadow-xs"
              style={{ top: `${projectedPins[activeNode].y}px` }}
            >
              Tag #{linkTag}
            </span>
          </div>
        )}

        {/* View Mode Switcher Pill */}
        <div className="absolute left-3 bottom-3 z-20 flex items-center gap-1 rounded-full border border-brand-ink/10 bg-card/85 p-1 backdrop-blur-md">
          <button
            type="button"
            title="Bio-Holographic Shader"
            onClick={() => setViewMode("holo")}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold transition-colors ${
              viewMode === "holo" ? "bg-brand text-white" : "text-brand-subtle hover:text-brand-ink"
            }`}
          >
            <Sparkles className="h-2.5 w-2.5" /> Holo
          </button>
          <button
            type="button"
            title="Clinical Surface Shading"
            onClick={() => setViewMode("clinical")}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold transition-colors ${
              viewMode === "clinical" ? "bg-brand text-white" : "text-brand-subtle hover:text-brand-ink"
            }`}
          >
            <Activity className="h-2.5 w-2.5" /> Clinical
          </button>
          <button
            type="button"
            title="X-Ray & Skeletal Core"
            onClick={() => setViewMode("xray")}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold transition-colors ${
              viewMode === "xray" ? "bg-brand text-white" : "text-brand-subtle hover:text-brand-ink"
            }`}
          >
            <Layers className="h-2.5 w-2.5" /> X-Ray
          </button>
        </div>

        {/* Zoom & Orbit Toolbar */}
        <div className="absolute right-3 bottom-3 z-20 flex items-center gap-1 rounded-full border border-brand-ink/10 bg-card/85 p-1 backdrop-blur-md">
          <button
            type="button"
            aria-label="Auto rotate"
            title={autoRotate ? "Pause rotation" : "Auto rotate 360°"}
            onClick={() => setAutoRotate((r) => !r)}
            className={`grid h-6 w-6 place-items-center rounded-full transition-colors ${
              autoRotate ? "bg-brand-lime text-brand-carbon" : "text-brand-ink hover:bg-muted"
            }`}
          >
            {autoRotate ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.15).toFixed(2)))}
            className="grid h-6 w-6 place-items-center rounded-full text-brand-ink hover:bg-muted transition-colors"
          >
            <ZoomOut className="h-3 w-3" />
          </button>
          <button
            type="button"
            aria-label="Reset view"
            title="Reset to anterior view"
            onClick={() => {
              setZoom(1);
              setRotation({ x: 0, y: 0 });
              setAutoRotate(false);
            }}
            className="grid h-6 w-6 place-items-center rounded-full text-brand-ink hover:bg-muted transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => setZoom((z) => Math.min(1.85, +(z + 0.15).toFixed(2)))}
            className="grid h-6 w-6 place-items-center rounded-full text-brand-ink hover:bg-muted transition-colors"
          >
            <ZoomIn className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-brand-line2/60 px-3.5 py-2 text-[9px] text-brand-subtle">
        <span>360° drag to orbit · scroll to zoom · tap organ beacons</span>
        <span className="font-mono">
          Rot: {Math.round(rotation.y)}° | Zoom: {zoom}x
        </span>
      </div>
    </section>
  );
}
