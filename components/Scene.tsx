"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, Stars } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

type V3 = [number, number, number];

// How far (world units) the camera travels down while you scroll the page.
const PATH = 16;
const scroll = { p: 0 };

function ScrollTracker() {
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return null;
}

/** Moves the camera down the page + a little mouse parallax. */
function CameraRig() {
  useFrame((state) => {
    const { camera, pointer } = state;
    const p = scroll.p;
    const tx = Math.sin(p * Math.PI * 2) * 2.2 + pointer.x * 0.9;
    const ty = -p * PATH + pointer.y * 0.5;
    const tz = 8 - Math.sin(p * Math.PI) * 2.5;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.07);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, tz, 0.04);
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, Math.sin(p * Math.PI * 2) * 0.05, 0.04);
    camera.lookAt(camera.position.x * 0.25, -p * PATH, 0);
  });
  return null;
}

/** Keeps lights and stars glued to the camera's height. */
function FollowCamera({ children }: { children: ReactNode }) {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ camera }) => {
    g.current.position.y = camera.position.y;
  });
  return <group ref={g}>{children}</group>;
}

function Galaxy({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null!);
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const blue = new THREE.Color("#3b82f6");
    const pink = new THREE.Color("#ff3d9a");
    const green = new THREE.Color("#22ff9c");
    const tmp = new THREE.Color();
    const RADIUS = 16;
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.7) * RADIUS;
      const branch = ((i % 3) / 3) * Math.PI * 2;
      const spin = r * 0.55;
      const spread = (Math.random() - 0.5) * (0.3 + r * 0.12);
      pos[i * 3] = Math.cos(branch + spin) * r + spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * (0.4 + r * 0.05);
      pos[i * 3 + 2] = Math.sin(branch + spin) * r + spread;
      const t = r / RADIUS;
      if (t < 0.5) tmp.copy(green).lerp(blue, t * 2);
      else tmp.copy(blue).lerp(pink, (t - 0.5) * 2);
      col[i * 3] = tmp.r;
      col[i * 3 + 1] = tmp.g;
      col[i * 3 + 2] = tmp.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.04;
    ref.current.position.y = -scroll.p * PATH * 0.6 - 4;
    ref.current.rotation.x = 0.7 + scroll.p * 0.6;
  });

  return (
    <points ref={ref} position={[0, -4, -9]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        sizeAttenuation
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Blob({ position, color, scale = 1, speed = 1.5 }: { position: V3; color: string; scale?: number; speed?: number }) {
  return (
    <Float speed={speed} rotationIntensity={1.2} floatIntensity={2}>
      <mesh position={position} scale={scale}>
        <icosahedronGeometry args={[1, 10]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          distort={0.45}
          speed={2}
          roughness={0.15}
          metalness={0.7}
        />
      </mesh>
    </Float>
  );
}

function Gyro({ position, scale = 1 }: { position: V3; scale?: number }) {
  const a = useRef<THREE.Mesh>(null!);
  const b = useRef<THREE.Mesh>(null!);
  const c = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    a.current.rotation.x += dt * 0.7;
    a.current.rotation.y += dt * 0.3;
    b.current.rotation.y += dt * 0.8;
    b.current.rotation.z += dt * 0.2;
    c.current.rotation.z += dt * 0.6;
    c.current.rotation.x += dt * 0.4;
  });
  return (
    <group position={position} scale={scale}>
      <mesh ref={a}>
        <torusGeometry args={[1.8, 0.025, 16, 140]} />
        <meshBasicMaterial color="#3b82f6" toneMapped={false} />
      </mesh>
      <mesh ref={b}>
        <torusGeometry args={[1.4, 0.025, 16, 140]} />
        <meshBasicMaterial color="#ff3d9a" toneMapped={false} />
      </mesh>
      <mesh ref={c}>
        <torusGeometry args={[1.0, 0.025, 16, 140]} />
        <meshBasicMaterial color="#22ff9c" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Crystal({ position, scale = 1, color = "#22ff9c" }: { position: V3; scale?: number; color?: string }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.35;
    ref.current.rotation.x += dt * 0.15;
  });
  return (
    <Float speed={1.2} floatIntensity={1.5}>
      <group ref={ref} position={position} scale={scale}>
        <mesh>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshBasicMaterial color={color} wireframe toneMapped={false} />
        </mesh>
        <mesh scale={0.62}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.08} emissive={color} emissiveIntensity={0.25} />
        </mesh>
      </group>
    </Float>
  );
}

function Knot({ position, scale = 1, wire = true, color = "#ffffff" }: { position: V3; scale?: number; wire?: boolean; color?: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    ref.current.rotation.x += dt * 0.25;
    ref.current.rotation.y += dt * 0.35;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusKnotGeometry args={[1, 0.28, 220, 28]} />
      {wire ? (
        <meshBasicMaterial color={color} wireframe transparent opacity={0.35} />
      ) : (
        <meshStandardMaterial color={color} metalness={1} roughness={0.12} emissive="#ff3d9a" emissiveIntensity={0.25} />
      )}
    </mesh>
  );
}

export default function Scene() {
  const count = useMemo(() => (typeof window !== "undefined" && window.innerWidth < 768 ? 4000 : 10000), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      eventSource={document.body}
      eventPrefix="client"
    >
      <ScrollTracker />
      <CameraRig />

      <FollowCamera>
        <ambientLight intensity={0.45} />
        <pointLight position={[6, 4, 4]} intensity={110} color="#3b82f6" />
        <pointLight position={[-6, -2, 4]} intensity={110} color="#ff3d9a" />
        <pointLight position={[0, -6, 3]} intensity={80} color="#22ff9c" />
        <Stars radius={70} depth={50} count={3000} factor={3.5} fade speed={1} />
      </FollowCamera>

      <Galaxy count={count} />

      {/* Hero */}
      <Blob position={[4, 0.8, -1]} color="#3b82f6" scale={1.5} />
      <Knot position={[0, 0, -5]} scale={1.8} />
      <Blob position={[-5, -1.5, -3]} color="#ff3d9a" scale={0.9} speed={2.2} />

      {/* About */}
      <Gyro position={[3.8, -4.5, -2]} scale={1.1} />
      <Blob position={[-4.2, -5.5, -2]} color="#ff3d9a" scale={1.2} speed={2} />

      {/* Skills */}
      <Crystal position={[4, -8.5, -2]} scale={1.3} color="#22ff9c" />
      <Blob position={[-4, -9.5, -1]} color="#22ff9c" scale={0.9} speed={2.5} />

      {/* Projects */}
      <Knot position={[-3.5, -12, -3]} scale={1.2} wire={false} color="#ffffff" />
      <Gyro position={[4.5, -12.5, -3]} scale={0.9} />

      {/* Contact */}
      <Crystal position={[-4.2, -15.5, -2]} scale={1.1} color="#3b82f6" />
      <Blob position={[4.2, -15.8, -2]} color="#ff3d9a" scale={1.3} />

      <Sparkles count={220} scale={[22, 36, 10]} position={[0, -8, 0]} size={3} speed={0.35} color="#22ff9c" />
      <Sparkles count={160} scale={[22, 36, 10]} position={[0, -8, -2]} size={2.5} speed={0.25} color="#ff3d9a" />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.5} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
