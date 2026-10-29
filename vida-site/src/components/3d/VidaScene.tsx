'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  uniform sampler2D tColor;
  uniform sampler2D tNormal;
  uniform sampler2D tSpecular;
  uniform sampler2D tNight;
  uniform sampler2D tClouds;
  uniform float uTime;
  uniform vec3 uSunPosition;

  void main() {
    // Base textures
    vec3 colorMap = texture2D(tColor, vUv).rgb;
    vec3 normalMap = texture2D(tNormal, vUv).rgb * 2.0 - 1.0; // rudimentary normal un-packing
    float specMap = texture2D(tSpecular, vUv).r;
    vec3 nightMap = texture2D(tNight, vUv).rgb;

    // Animate clouds slightly
    vec2 cloudUv = vec2(vUv.x + uTime * 0.005, vUv.y);
    vec4 cloudMap = texture2D(tClouds, cloudUv);

    // Lighting
    vec3 viewDirection = normalize(-vPosition);
    vec3 sunDir = normalize(uSunPosition);

    // Standard N dot L with slight wrap
    float diff = max(dot(vNormal, sunDir), 0.0);

    // Day color
    vec3 dayColor = colorMap * diff;

    // Specular (Ocean reflection)
    vec3 reflection = reflect(-sunDir, vNormal);
    float spec = pow(max(dot(viewDirection, reflection), 0.0), 32.0) * specMap;
    dayColor += vec3(spec);

    // Night color
    float nightMix = smoothstep(0.1, -0.1, dot(vNormal, sunDir));
    vec3 nightColor = nightMap * nightMix;

    // Combine day and night
    vec3 finalColor = dayColor + nightColor;

    // Add Clouds
    float cloudShadow = max(0.0, diff - 0.2); // Clouds are darker on the night side
    vec3 clouds = cloudMap.rgb * cloudMap.a * (cloudShadow + 0.1);
    finalColor = mix(finalColor, clouds, cloudMap.a * 0.8);

    // Atmosphere (Fresnel)
    float fresnel = pow(1.0 - max(dot(vNormal, viewDirection), 0.0), 3.0);
    vec3 atmosphereColor = vec3(0.3, 0.6, 1.0) * fresnel * diff; // Atmosphere only lit by sun
    finalColor += atmosphereColor;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function RealisticEarth() {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const [colorMap, normalMap, specMap, cloudsMap, nightMap] = useTexture([
    '/textures/earth_color.jpg',
    '/textures/earth_normal.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_clouds.png',
    '/textures/earth_night.jpg'
  ]);

  const uniforms = useMemo(() => ({
    tColor: { value: colorMap },
    tNormal: { value: normalMap },
    tSpecular: { value: specMap },
    tClouds: { value: cloudsMap },
    tNight: { value: nightMap },
    uTime: { value: 0 },
    uSunPosition: { value: new THREE.Vector3(5, 3, 5) }
  }), [colorMap, normalMap, specMap, cloudsMap, nightMap]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group ref={groupRef}>
        <Sphere args={[2, 64, 64]}>
            <shaderMaterial
                ref={materialRef}
                vertexShader={earthVertexShader}
                fragmentShader={earthFragmentShader}
                uniforms={uniforms}
            />
        </Sphere>
    </group>
  );
}

function SceneController() {
    const groupRef = useRef<THREE.Group>(null);
    const pointer = useRef(new THREE.Vector2());
    const targetPointer = useRef(new THREE.Vector2());

    const [scrollState, setScrollState] = useState(0);
    const scrollContainerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        // Find the scrollable container we created in page.tsx
        const container = document.getElementById('vida-content-scroll');
        if (container) {
            scrollContainerRef.current = container;
            const handleScroll = () => {
                setScrollState(container.scrollTop);
            };
            container.addEventListener('scroll', handleScroll, { passive: true });
            return () => container.removeEventListener('scroll', handleScroll);
        } else {
            // Fallback for window scroll
            const handleScroll = () => {
                setScrollState(window.scrollY);
            };
            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            targetPointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            targetPointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame(({ camera }) => {
        // Smooth pointer tracking for camera parallax
        pointer.current.lerp(targetPointer.current, 0.05);

        if (groupRef.current) {
            const scrollY = scrollState;
            const maxScroll = scrollContainerRef.current
                ? scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight
                : document.body.scrollHeight - window.innerHeight;

            const scrollNormalized = Math.min(scrollY / (maxScroll || 1), 1.0);

            // As we scroll down, move the earth to the right and scale it down slightly
            const targetX = scrollNormalized * 3.5;
            const targetY = scrollNormalized * -1.0;
            const targetScale = 1.0 - scrollNormalized * 0.2;

            groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.05;
            groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;

            const currentScale = groupRef.current.scale.x;
            const newScale = currentScale + (targetScale - currentScale) * 0.05;
            groupRef.current.scale.set(newScale, newScale, newScale);

            // Camera Parallax based on scroll and mouse
            const targetCameraY = -scrollY * 0.001 + pointer.current.y * 0.5;
            const targetCameraX = pointer.current.x * 0.5;

            camera.position.y += (targetCameraY - camera.position.y) * 0.05;
            camera.position.x += (targetCameraX - camera.position.x) * 0.05;

            camera.lookAt(0, 0, 0);
        }
    });

    return (
        <group ref={groupRef}>
            <RealisticEarth />
        </group>
    );
}

export function VidaScene() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <SceneController />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            intensity={1.2}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}