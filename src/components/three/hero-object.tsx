"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * El único objeto 3D del sitio: un neumático de F1 de intermedios.
 *
 * Es procedural —un perfil girado sobre su eje, unas cuantas primitivas—, así
 * que no hay modelo que descargar: pesa lo que pesa el código. Gira sobre su
 * eje, más deprisa cuanto más rápido se hace scroll (como una rueda que
 * acelera) y se inclina siguiendo el puntero con retardo.
 *
 * Toda la geometría está en coordenadas locales con el eje de la rueda en Y;
 * el grupo exterior lo gira para presentarlo de tres cuartos.
 */

/* ------------------------------------------------------------------ */
/* Medidas (en unidades de escena)                                     */
/* ------------------------------------------------------------------ */

const R = 1.38; // radio de la banda de rodadura
const H = 0.52; // semiancho total, de flanco a flanco
const RB = 0.84; // radio del talón: donde el neumático abraza la llanta
const TREAD = 0.4; // semiancho de la banda plana
const SHOULDER = 0.16; // cuánto se redondea el hombro
const SIDE_IN = RB + 0.03;
const SIDE_OUT = R - SHOULDER;

/** El flanco abomba un poco hacia fuera, como uno real con presión. */
const bulge = (r: number) =>
  0.03 * Math.sin((Math.PI * (r - SIDE_IN)) / (SIDE_OUT - SIDE_IN));
const sideY = (r: number) => H + bulge(r);

const COLORS = {
  rubber: "#0c1c26",
  rim: "#1d3b4d",
  spoke: "#9fc2d6",
  compound: "#34f5a0", // verde: la banda de los neumáticos de intermedios
  azure: "#0a52d6",
  tick: "#f2fcf9",
};

/* ------------------------------------------------------------------ */
/* Geometría                                                           */
/* ------------------------------------------------------------------ */

/**
 * Perfil de la sección del neumático, de talón a talón por fuera. El orden
 * importa: LatheGeometry orienta las normales según el sentido en que se
 * recorre, y así recorrido (de abajo arriba por el lado exterior) todas
 * apuntan hacia fuera.
 */
function buildTireProfile(): THREE.Vector2[] {
  const p: THREE.Vector2[] = [];
  const add = (r: number, y: number) => p.push(new THREE.Vector2(r, y));

  add(RB, -H + 0.05);

  // Flanco inferior, de dentro hacia fuera.
  for (let i = 0; i <= 12; i++) {
    const r = SIDE_IN + ((SIDE_OUT - SIDE_IN) * i) / 12;
    add(r, -sideY(r));
  }

  // Hombro inferior: un cuarto de elipse.
  for (let i = 1; i <= 8; i++) {
    const t = -Math.PI / 2 + ((Math.PI / 2) * i) / 8;
    add(SIDE_OUT + SHOULDER * Math.cos(t), -TREAD + (H - TREAD) * Math.sin(t));
  }

  // Banda de rodadura con tres surcos longitudinales.
  for (const g of [-0.2, 0, 0.2]) {
    add(R, g - 0.045);
    add(R - 0.04, g - 0.025);
    add(R - 0.04, g + 0.025);
    add(R, g + 0.045);
  }
  add(R, TREAD);

  // Hombro superior.
  for (let i = 1; i <= 8; i++) {
    const t = ((Math.PI / 2) * i) / 8;
    add(SIDE_OUT + SHOULDER * Math.cos(t), TREAD + (H - TREAD) * Math.sin(t));
  }

  // Flanco superior, de fuera hacia dentro.
  for (let i = 0; i <= 12; i++) {
    const r = SIDE_OUT - ((SIDE_OUT - SIDE_IN) * i) / 12;
    add(r, sideY(r));
  }

  add(RB, H - 0.05);
  return p;
}

/* ------------------------------------------------------------------ */
/* Piezas                                                              */
/* ------------------------------------------------------------------ */

/** Cara de la llanta: disco, aro, cinco radios y tuerca central. */
function WheelFace({ side }: { side: 1 | -1 }) {
  const y = 0.31 * side;

  return (
    <group>
      <mesh position={[0, y, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.05, 64]} />
        <meshStandardMaterial color={COLORS.rim} metalness={0.6} roughness={0.4} />
      </mesh>

      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.46, y + 0.035 * side, Math.sin(a) * 0.46]}
            rotation={[0, -a, 0]}
          >
            <boxGeometry args={[0.66, 0.04, 0.12]} />
            <meshStandardMaterial
              color={COLORS.spoke}
              metalness={0.75}
              roughness={0.3}
            />
          </mesh>
        );
      })}

      <mesh position={[0, y + 0.06 * side, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.1, 6]} />
        <meshBasicMaterial color={COLORS.compound} toneMapped={false} />
      </mesh>

      {/* Labio de la llanta, donde acaba el metal y empieza la goma. */}
      <mesh position={[0, 0.455 * side, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.83, 0.026, 12, 96]} />
        <meshStandardMaterial color={COLORS.azure} metalness={0.5} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** Banda de compuesto y marcas de desgaste en un flanco. */
function Sidewall({ side }: { side: 1 | -1 }) {
  const ticks = useRef<THREE.InstancedMesh>(null);
  const COUNT = 48;
  const TICK_R = 1.18;
  const y = sideY(TICK_R) * side + 0.006 * side;

  useLayoutEffect(() => {
    const mesh = ticks.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const pos = new THREE.Vector3();
    const one = new THREE.Vector3(1, 1, 1);

    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * Math.PI * 2;
      pos.set(Math.cos(a) * TICK_R, y, Math.sin(a) * TICK_R);
      q.setFromEuler(e.set(0, -a, 0));
      m.compose(pos, q, one);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [y]);

  const ringY = (sideY(1.04) + 0.005) * side;

  return (
    <group>
      <mesh position={[0, ringY, 0]} rotation={[(-Math.PI / 2) * side, 0, 0]}>
        <ringGeometry args={[0.96, 1.1, 128]} />
        <meshBasicMaterial
          color={COLORS.compound}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-2}
        />
      </mesh>

      <instancedMesh ref={ticks} args={[undefined, undefined, COUNT]}>
        <boxGeometry args={[0.075, 0.012, 0.022]} />
        <meshBasicMaterial
          color={COLORS.tick}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-3}
        />
      </instancedMesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Escena                                                              */
/* ------------------------------------------------------------------ */

interface TireProps {
  pointer: React.RefObject<{ x: number; y: number }>;
  scrollProgress: React.RefObject<number>;
}

function Tire({ pointer, scrollProgress }: TireProps) {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const profile = useMemo(() => buildTireProfile(), []);

  // Giro: una velocidad de crucero más la que da el scroll, que se amortigua.
  const lastScroll = useRef(0);
  const boost = useRef(0);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05); // Un frame perdido no debe dar un salto.
    const g = tilt.current;
    const s = spin.current;
    if (!g || !s) return;

    const p = pointer.current ?? { x: 0, y: 0 };
    // Interpolación hacia el objetivo: el retardo es lo que lo hace sentir pesado.
    g.rotation.x += (-0.32 + p.y * 0.3 - g.rotation.x) * d * 3;
    g.rotation.y += (0.62 + p.x * 0.4 - g.rotation.y) * d * 3;

    // Al bajar, la rueda se encoge y cede el sitio al contenido.
    g.scale.setScalar(1.04 - Math.min(scrollProgress.current ?? 0, 1) * 0.55);

    const y = window.scrollY;
    const speed = Math.min(Math.abs(y - lastScroll.current) / Math.max(d, 0.001), 6000);
    lastScroll.current = y;
    boost.current += (speed * 0.0016 - boost.current) * d * 5;

    s.rotation.y -= d * (0.9 + boost.current);
  });

  return (
    <group ref={tilt} rotation={[-0.32, 0.62, 0]}>
      {/* Pone el eje de la rueda (Y local) mirando a la cámara. */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <group ref={spin}>
          <mesh>
            <latheGeometry args={[profile, 128]} />
            <meshStandardMaterial color={COLORS.rubber} roughness={0.78} metalness={0.06} />
          </mesh>

          {/* Barril de la llanta: sin él, por el hueco se ve el flanco de atrás. */}
          <mesh>
            <cylinderGeometry args={[0.83, 0.83, H * 2 - 0.1, 64, 1, true]} />
            <meshStandardMaterial
              color={COLORS.rim}
              metalness={0.5}
              roughness={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>

          <WheelFace side={1} />
          <WheelFace side={-1} />
          <Sidewall side={1} />
          <Sidewall side={-1} />
        </group>
      </group>
    </group>
  );
}

export default function HeroObject({
  pointer,
  scrollProgress,
  active,
}: TireProps & { active: boolean }) {
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
      {/*
        Luz de pista: una clave blanca desde arriba a la derecha, un contraluz
        verde por abajo a la izquierda y otro azur por detrás, que es lo que
        dibuja el perfil de la goma oscura sobre el fondo claro.
      */}
      <ambientLight intensity={0.9} color="#ffffff" />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[-4, -2.5, 2]} intensity={1.8} color="#34f5a0" />
      <directionalLight position={[-2, 3, -4]} intensity={2.2} color="#3d8bff" />
      <Tire pointer={pointer} scrollProgress={scrollProgress} />
    </Canvas>
  );
}
