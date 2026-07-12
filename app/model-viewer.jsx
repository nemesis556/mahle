"use client";
import { Canvas } from "@react-three/fiber";
import { Center, ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function Station({ url }) {
  const { scene } = useGLTF(url);
  return <Center><primitive object={scene} /></Center>;
}

export default function ModelViewer({ source, accent }) {
  return <Canvas camera={{ position: [24, 17, 28], fov: 29 }} dpr={[1, 1.7]} gl={{ antialias: true, alpha: true }}>
    <color attach="background" args={["#071017"]} />
    <ambientLight intensity={1.5} />
    <directionalLight position={[5, 8, 4]} intensity={4} color="#d9f8ff" />
    <pointLight position={[-5, 2, -4]} intensity={22} color={accent} distance={18} />
    <Suspense fallback={null}><Station url={source} /></Suspense>
    <ContactShadows position={[0, -5.4, 0]} opacity={0.5} scale={43} blur={2.6} far={12} />
    <OrbitControls makeDefault enablePan={false} minDistance={21} maxDistance={52} minPolarAngle={0.65} maxPolarAngle={1.65} autoRotate autoRotateSpeed={0.42} />
  </Canvas>;
}
