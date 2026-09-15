"use client";

import { Component, Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, useProgress } from "@react-three/drei";
import { RotateCw } from "lucide-react";
import type { Car } from "@/types/car";
import CarVisual from "@/components/ui/CarVisual";
import { cn } from "@/lib/format";

// Real 3D rendering for a car once a .glb/.gltf model exists at
// car.media.model3dUrl (see the Manufacturer/media data layer — nothing is
// bundled here, this only renders a model the project owner supplies).
// Falls back to the existing 2D artwork (CarVisual, itself photo-or-SVG)
// whenever no model is set, or if the model fails to load, so a missing or
// broken .glb file can never crash the page or show empty geometry.

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function Loader() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
      <RotateCw className="w-5 h-5 text-accent animate-spin" />
      <span className="text-xs text-muted font-display tabular-nums">{Math.round(progress)}%</span>
    </div>
  );
}

interface BoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("3D model failed to load, falling back to 2D artwork:", error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export default function Car3DViewer({ car, className }: { car: Car; className?: string }) {
  const modelUrl = car.media.model3dUrl;

  if (!modelUrl) {
    return <CarVisual car={car} showLabel={false} className={className} />;
  }

  return (
    <ModelErrorBoundary fallback={<CarVisual car={car} showLabel={false} className={className} />}>
      <div className={cn("relative", className)}>
        <Canvas camera={{ position: [4.5, 1.6, 4.5], fov: 32 }} dpr={[1, 2]} gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.55} shadows="contact" adjustCamera>
              <Model url={modelUrl} />
            </Stage>
          </Suspense>
          <OrbitControls
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.1}
            minDistance={2.5}
            maxDistance={9}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Canvas>
        <Loader />
      </div>
    </ModelErrorBoundary>
  );
}
