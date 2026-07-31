/* eslint-disable react/no-unknown-property */
"use client";

import React, { useState, useEffect, Suspense, useMemo, useRef } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

extend({ MeshLineGeometry, MeshLineMaterial });

const cardGLB = "/web/assets/lanyard/card.glb";
const lanyardTexture = "/web/assets/lanyard/lanyard.png";

export default function Lanyard({
  position = [0, 0, 26] as [number, number, number],
  gravity = [0, -40, 0] as [number, number, number],
  fov = 24,
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="h-screen w-full bg-transparent">
      <Canvas camera={{ position, fov }} gl={{ antialias: true }}>
        <ambientLight intensity={Math.PI} />
        <Suspense fallback={null}>
          {/* Interpolate false membantu stabilitas pada gerakan cepat */}
          <Physics gravity={gravity} timeStep="vary" interpolate={false}>
            <Band />
          </Physics>
        </Suspense>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band() {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyardTexture) as THREE.Texture;

  const lineMaterial = useMemo(() => {
    if (!texture || !(texture instanceof THREE.Texture)) return null;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;

    const mat = new MeshLineMaterial({
      map: texture,
      useMap: 1,
      color: new THREE.Color("white"),
      lineWidth: 1,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
      repeat: new THREE.Vector2(-4, 1),
    } as any);

    (mat as any).transparent = true;
    return mat;
  }, [texture]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);

  // Joint untuk tali diatur stabil (1.0) agar solver fisika Rapier tidak pernah menghasilkan NaN
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      // Menghitung posisi kursor di ruang 3D
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());

      // Optimasi: Menggunakan LERP agar gerakan mengikuti mouse secara halus (smooth)
      const currentTrans = card.current.translation();
      const targetX = vec.x - dragged.x;
      const targetY = vec.y - dragged.y;
      const targetZ = vec.z - dragged.z;

      card.current?.setNextKinematicTranslation({
        x: THREE.MathUtils.lerp(currentTrans.x, targetX, 0.25),
        y: THREE.MathUtils.lerp(currentTrans.y, targetY, 0.25),
        z: THREE.MathUtils.lerp(currentTrans.z, targetZ, 0.25),
      });
    }

    if (fixed.current && j1.current && j2.current && j3.current && band.current) {
      const j3Pos = j3.current.translation();
      const fixedPos = fixed.current.translation();

      if (
        j3Pos &&
        fixedPos &&
        !isNaN(j3Pos.x) &&
        !isNaN(j3Pos.y) &&
        !isNaN(j3Pos.z)
      ) {
        [j1, j2].forEach((ref) => {
          if (!ref.current.lerped)
            ref.current.lerped = new THREE.Vector3().copy(
              ref.current.translation(),
            );
          const trans = ref.current.translation();
          if (trans && !isNaN(trans.x) && !isNaN(trans.y) && !isNaN(trans.z)) {
            ref.current.lerped.lerp(trans, delta * 20);
          }
        });

        curve.points[0].copy(j3Pos);
        curve.points[1].copy(j2.current.lerped);
        curve.points[2].copy(j1.current.lerped);
        curve.points[3].copy(fixedPos);
        band.current.geometry.setPoints(curve.getPoints(32));
      }

      // Mengontrol rotasi liar secara aman dari nilai NaN
      if (card.current) {
        ang.copy(card.current.angvel());
        const rotQuat = card.current.rotation();
        if (rotQuat && !isNaN(rotQuat.x)) {
          const quaternion = new THREE.Quaternion(
            rotQuat.x,
            rotQuat.y,
            rotQuat.z,
            rotQuat.w,
          );
          const euler = new THREE.Euler().setFromQuaternion(quaternion);
          card.current.setAngvel({
            x: ang.x,
            y: ang.y - euler.y * 0.25,
            z: ang.z,
          });
        }
      }
    }
  });

  if (!nodes || !materials) return null;

  return (
    <>
      <group position={[0, 5, 0]}>
        <RigidBody ref={fixed} type="fixed" />
        {/* Damping ditingkatkan agar tali tidak memantul berlebihan */}
        <RigidBody
          position={[0.5, 0, 0]}
          ref={j1}
          linearDamping={3}
          angularDamping={2}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1, 0, 0]}
          ref={j2}
          linearDamping={3}
          angularDamping={2}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1.5, 0, 0]}
          ref={j3}
          linearDamping={3}
          angularDamping={2}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          type={dragged ? "kinematicPosition" : "dynamic"}
          colliders={false}
          angularDamping={3} // Hambatan rotasi: mencegah kartu berputar liar
          linearDamping={1.5} // Hambatan gerak: mencegah kartu melayang tanpa bobot
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerUp={(e) => {
              (e.target as any).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as any).setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation())),
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials?.base?.map || null}
                roughness={1}
                metalness={0.5}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      {lineMaterial && (
        <mesh ref={band} material={lineMaterial}>
          <meshLineGeometry />
        </mesh>
      )}
    </>
  );
}
