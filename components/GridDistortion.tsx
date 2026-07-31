"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface GridDistortionProps {
  imageSrc: string;
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  className?: string;
}

export default function GridDistortion({
  imageSrc,
  grid = 10,
  mouse = 0.25,
  strength = 0.15,
  relaxation = 0.9,
  className = "",
}: GridDistortionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      1,
      1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Uniforms & Shader Material
    const uniforms = {
      uTime: { value: 0 },
      uTexture: { value: new THREE.Texture() },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRadius: { value: mouse },
      uStrength: { value: strength },
      uResolution: { value: new THREE.Vector2(width, height) },
      uImageResolution: { value: new THREE.Vector2(1, 1) },
    };

    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uRadius;
      uniform float uStrength;
      varying vec2 vUv;
      varying float vDistortion;

      void main() {
        vUv = uv;
        vec3 pos = position;
        
        float dist = distance(uv, uMouse);
        float influence = smoothstep(uRadius, 0.0, dist);
        vDistortion = influence;
        
        vec2 dir = uv - uMouse;
        pos.z += influence * uStrength * 40.0;
        pos.x += dir.x * influence * uStrength * 15.0;
        pos.y += dir.y * influence * uStrength * 15.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform float uRadius;
      uniform float uStrength;
      uniform vec2 uResolution;
      uniform vec2 uImageResolution;
      varying vec2 vUv;
      varying float vDistortion;

      vec2 getCoverUv(vec2 uv, vec2 resolution, vec2 texResolution) {
        vec2 s = resolution;
        vec2 i = texResolution;
        float rs = s.x / s.y;
        float ri = i.x / i.y;
        vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
        vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
        return uv * s / new + offset;
      }

      void main() {
        vec2 uv = getCoverUv(vUv, uResolution, uImageResolution);
        
        float dist = distance(vUv, uMouse);
        float effect = smoothstep(uRadius, 0.0, dist);
        vec2 dir = vUv - uMouse;
        uv -= dir * effect * uStrength * 0.6;
        
        vec4 color = texture2D(uTexture, uv);
        
        // Cinematic color harmonization to match website emerald cyberpunk palette (#61dca3)
        vec3 col = color.rgb;
        col = mix(col, col * vec3(0.92, 1.05, 1.05), 0.4);
        
        gl_FragColor = vec4(col, color.a);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
    });

    // 3. Plane Geometry (Grid x Grid subdivisions)
    const geometry = new THREE.PlaneGeometry(width, height, grid, grid);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 4. Load External Image Texture with CORS Anonymous
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      imageSrc,
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        uniforms.uTexture.value = texture;
        uniforms.uImageResolution.value.set(
          texture.image.width || 1,
          texture.image.height || 1
        );
      },
      undefined,
      (err) => {
        console.error("GridDistortion texture load error:", err);
      }
    );

    // 5. Mouse tracking with Relaxation lerp
    const targetMouse = { x: 0.5, y: 0.5 };
    const currentMouse = { x: 0.5, y: 0.5 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1.0 - (event.clientY - rect.top) / rect.height; // WebGL UV y is inverted
      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        targetMouse.x = x;
        targetMouse.y = y;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const rect = container.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width;
        const y = 1.0 - (touch.clientY - rect.top) / rect.height;
        if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
          targetMouse.x = x;
          targetMouse.y = y;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    // 6. Handle Window Resizes
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;

      camera.left = -newWidth / 2;
      camera.right = newWidth / 2;
      camera.top = newHeight / 2;
      camera.bottom = -newHeight / 2;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      uniforms.uResolution.value.set(newWidth, newHeight);

      // Rebuild geometry to match new dimensions
      mesh.geometry.dispose();
      mesh.geometry = new THREE.PlaneGeometry(newWidth, newHeight, grid, grid);
    };

    window.addEventListener("resize", handleResize);

    // 7. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      uniforms.uTime.value += delta;

      // Smooth lerp mouse position based on relaxation
      const lerpFactor = Math.max(0.01, 1 - relaxation * 0.92);
      currentMouse.x += (targetMouse.x - currentMouse.x) * lerpFactor;
      currentMouse.y += (targetMouse.y - currentMouse.y) * lerpFactor;
      uniforms.uMouse.value.set(currentMouse.x, currentMouse.y);

      // Dynamically update strength & radius props if changed
      uniforms.uRadius.value = mouse;
      uniforms.uStrength.value = strength;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [imageSrc, grid, mouse, strength, relaxation]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    />
  );
}
