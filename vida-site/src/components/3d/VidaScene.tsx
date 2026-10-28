'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Animate a glowing biological/planetary object to represent "VIDA"
function GlowingCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = t * 0.1;

      // Gentle breathing animation
      const scale = 1.5 + Math.sin(t * 1.2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 128, 128]}>
      <MeshDistortMaterial
        color="#000000"
        emissive="#047857"
        emissiveIntensity={0.2}
        distort={0.3}
        speed={2}
        roughness={0.1}
        metalness={0.9}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
      {/* Inner glowing core for transmission effect depth */}
      <Sphere args={[0.7, 32, 32]}>
          <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.15} />
      </Sphere>
    </Sphere>
  );
}

// Simplex 3D Noise function for shaders
const noise3D = `
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation polynomials and a gradient
// lookup one-dimensional texture, and for the
// computation of the gradient vector by Taylor expansion.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/stegu/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
  }
`;

const particleVertexShader = `
  ${noise3D}

  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uScroll;
  attribute vec3 aColor;
  attribute float aSize;
  varying vec3 vColor;

  void main() {
    vColor = aColor;

    // Base position
    vec3 pos = position;

    // Spread based on scroll
    float spread = 1.0 + (uScroll * 0.001);
    pos *= spread;

    // Add noise-based movement
    float noiseFreq = 0.5;
    float noiseAmp = 0.8;
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime * 0.2, pos.y * noiseFreq + uTime * 0.2, pos.z * noiseFreq);

    pos.x += snoise(noisePos) * noiseAmp;
    pos.y += snoise(noisePos + vec3(10.0)) * noiseAmp;
    pos.z += snoise(noisePos + vec3(20.0)) * noiseAmp;

    // Mouse interaction (repulsion)
    float dist = distance(pos, uMouse);
    float repulsionRadius = 4.0;
    if(dist < repulsionRadius) {
       vec3 dir = normalize(pos - uMouse);
       float force = (repulsionRadius - dist) / repulsionRadius;
       pos += dir * force * 1.5;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Size attenuation based on distance
    gl_PointSize = aSize * (10.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  varying vec3 vColor;

  void main() {
    // Create a soft circle instead of a square
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float alpha = 1.0 - smoothstep(0.1, 0.5, distanceToCenter);

    // Soften opacity for glowing effect
    gl_FragColor = vec4(vColor, alpha * 0.8);
  }
`;

// Advanced shader-based particle ecosystem
function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const particlesCount = 4000;

  // Use state to generate initial particles once, keeping React pure
  const [{ positions, colors, sizes }] = useState(() => {
    const pos = new Float32Array(particlesCount * 3);
    const col = new Float32Array(particlesCount * 3);
    const sz = new Float32Array(particlesCount);

    const colorEmerald = new THREE.Color('#34d399');
    const colorGold = new THREE.Color('#fbbf24');
    const colorDeepBlue = new THREE.Color('#0ea5e9');

    for(let i = 0; i < particlesCount; i++) {
      // Torus-like distribution with noise
      const radius = 3 + Math.random() * 8;
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 2;

      const tubeRadius = 1.5 + Math.random() * 2;

      pos[i*3] = (radius + tubeRadius * Math.cos(angle2)) * Math.cos(angle1) + (Math.random() - 0.5);
      pos[i*3+1] = tubeRadius * Math.sin(angle2) + (Math.random() - 0.5) * 4;
      pos[i*3+2] = (radius + tubeRadius * Math.cos(angle2)) * Math.sin(angle1) + (Math.random() - 0.5);

      // Color gradient based on radius
      const mixedColor = new THREE.Color();
      const rand = Math.random();

      if (rand < 0.6) {
          mixedColor.copy(colorEmerald).lerp(colorDeepBlue, Math.random() * 0.3);
      } else {
          mixedColor.copy(colorGold).lerp(colorEmerald, Math.random() * 0.5);
      }

      col[i*3] = mixedColor.r;
      col[i*3+1] = mixedColor.g;
      col[i*3+2] = mixedColor.b;

      sz[i] = 2.0 + Math.random() * 4.0;
    }

    return { positions: pos, colors: col, sizes: sz };
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, 0) },
    uScroll: { value: 0 }
  }), []);

  useEffect(() => {
    const handleScroll = () => {
      uniforms.uScroll.value = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [uniforms]);

  useFrame((state) => {
    if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

        // Mouse interaction mapped to shader uniform
        const vector = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5);
        vector.unproject(state.camera);
        const dir = vector.sub(state.camera.position).normalize();
        const distance = -state.camera.position.z / dir.z;
        const pos = state.camera.position.clone().add(dir.multiplyScalar(distance));

        // Smoothly interpolate mouse position for organic feel
        materialRef.current.uniforms.uMouse.value.lerp(pos, 0.05);
    }
    if (pointsRef.current) {
        // Slow overall rotation influenced by scroll
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02 + window.scrollY * 0.0005;
        pointsRef.current.position.y = window.scrollY * 0.002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
         <bufferAttribute
          attach="attributes-aColor"
          args={[colors, 3]}
          count={particlesCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
          count={particlesCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function VidaScene() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-50 transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#10b981" />

        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <GlowingCore />
        <Particles />

        <Environment preset="night" />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={1.5}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
