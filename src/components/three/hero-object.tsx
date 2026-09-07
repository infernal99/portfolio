"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * El único objeto 3D del sitio: un sólido facetado que gira lento sobre sí
 * mismo y se inclina siguiendo el puntero con retardo. Dos mallas —núcleo
 * macizo y jaula de alambre— para dar la lectura de "hay ingeniería detrás"
 * sin convertir la página en una demo.
 */

interface SolidProps {
  pointer: React.RefObject<{ x: number; y: number }>;
  scrollProgress: React.RefObject<number>;
}

function Solid({ pointer, scrollProgress }: SolidProps) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const cage = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05); // Un frame perdido no debe dar un salto.
    const g = group.current;
    if (!g) return;

    const p = pointer.current ?? { x: 0, y: 0 };
    // Interpolación hacia el objetivo: el retardo es lo que lo hace sentir pesado.
    g.rotation.x += (p.y * 0.35 - g.rotation.x) * d * 3;
    g.rotation.y += (p.x * 0.5 - g.rotation.y) * d * 3;

    // Al bajar, el objeto se encoge y cede el sitio al contenido.
    const s = 1 - Math.min(scrollProgress.current ?? 0, 1) * 0.55;
    g.scale.setScalar(s);

    if (core.current) core.current.rotation.y += d * 0.22;
    if (cage.current) {
      cage.current.rotation.y -= d * 0.14;
      cage.current.rotation.z += d * 0.05;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.24, 1]} />
        <meshStandardMaterial
          color="#d9a273"
          roughness={0.46}
          metalness={0.3}
          flatShading
        />
      </mesh>
      <mesh ref={cage} scale={1.55}>
        <icosahedronGeometry args={[1.24, 0]} />
        <meshBasicMaterial color="#171512" wireframe transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

export default function HeroObject({
  pointer,
  scrollProgress,
  active,
}: SolidProps & { active: boolean }) {
  return (
    <Canvas
      // dpr limitado: en pantallas retina el coste sube al cuadrado y aquí no
      // se nota la diferencia por encima de 1.5.
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "demand"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6.4], fov: 40 }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={1.05} color="#f6f1e8" />
      <directionalLight position={[3, 4, 5]} intensity={1.25} color="#ffdcb8" />
      <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#c2571e" />
      <Solid pointer={pointer} scrollProgress={scrollProgress} />
    </Canvas>
  );
}

