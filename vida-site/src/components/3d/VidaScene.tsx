'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

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

const earthVertexShader = `
  ${noise3D}

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Slight procedural deformation for mountains/terrain
    float noiseVal = snoise(position * 2.0 + uTime * 0.05);
    vec3 newPos = position + normal * noiseVal * 0.02;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const earthFragmentShader = `
  ${noise3D}

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3 uMouse;

  void main() {
    // Generate continents via noise
    float n1 = snoise(vPosition * 1.5);
    float n2 = snoise(vPosition * 4.0 + uTime * 0.02);
    float elevation = n1 * 0.5 + n2 * 0.25;

    vec3 oceanColor = vec3(0.02, 0.05, 0.15); // Deep dark blue ocean
    vec3 shallowColor = vec3(0.0, 0.2, 0.3); // Shallow water
    vec3 landColor = vec3(0.05, 0.25, 0.15); // Dark green land
    vec3 mountainColor = vec3(0.2, 0.3, 0.25); // Greyish green mountains
    vec3 cityLightColor = vec3(1.0, 0.8, 0.4); // Golden city lights

    vec3 color = oceanColor;
    float cityLights = 0.0;

    if (elevation > 0.1) {
      // Land
      color = mix(landColor, mountainColor, smoothstep(0.1, 0.5, elevation));

      // Add city lights on land edges (coasts)
      float coastDist = abs(elevation - 0.1);
      if (coastDist < 0.05) {
         float cityNoise = snoise(vPosition * 20.0);
         if (cityNoise > 0.6) {
             cityLights = smoothstep(0.6, 1.0, cityNoise) * (1.0 - coastDist*20.0);
         }
      }
    } else {
      // Water
      color = mix(oceanColor, shallowColor, smoothstep(-0.2, 0.1, elevation));
    }

    // Add city lights emission
    color += cityLightColor * cityLights * 2.0;

    // Atmospheric scattering (Fresnel effect) - make it react to mouse
    float mouseInfluence = smoothstep(0.0, 3.0, distance(vPosition, uMouse));
    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
    vec3 atmosphereColor = vec3(0.1, 0.4, 0.8) * intensity * (1.5 + mouseInfluence * 0.5);

    // Diffuse lighting from directional light (fake light from top-right)
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);

    // Shadow side needs less city lights if not dark, but let's make cities glow in the dark
    float dayNight = smoothstep(-0.2, 0.2, diff);
    color += cityLightColor * cityLights * (1.0 - dayNight) * 3.0; // Brighter on night side

    color = color * (diff * 0.8 + 0.2); // ambient + diffuse
    color += atmosphereColor;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function ProceduralEarth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, 0) }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

      const vector = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5);
      vector.unproject(state.camera);
      const dir = vector.sub(state.camera.position).normalize();
      const distance = -state.camera.position.z / dir.z;
      const pos = state.camera.position.clone().add(dir.multiplyScalar(distance));

      materialRef.current.uniforms.uMouse.value.lerp(pos, 0.05);
    }
  });

  return (
    <Sphere args={[2, 64, 64]} ref={meshRef}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={earthVertexShader}
        fragmentShader={earthFragmentShader}
        uniforms={uniforms}
      />
    </Sphere>
  );
}

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

    // Base position (sphere distribution)
    vec3 pos = position;

    // Orbiting motion around Earth
    float angle = uTime * 0.1 + (pos.y * 2.0); // varied speed based on height
    float s = sin(angle);
    float c = cos(angle);
    mat2 rotMatrix = mat2(c, -s, s, c);

    vec2 rotatedXZ = rotMatrix * vec2(pos.x, pos.z);
    pos.x = rotatedXZ.x;
    pos.z = rotatedXZ.y;

    // Add noise-based movement for organic data flow
    float noiseFreq = 1.5;
    float noiseAmp = 0.2;
    vec3 noisePos = vec3(pos.x * noiseFreq, pos.y * noiseFreq + uTime * 0.2, pos.z * noiseFreq);

    pos.x += snoise(noisePos) * noiseAmp;
    pos.y += snoise(noisePos + vec3(10.0)) * noiseAmp;
    pos.z += snoise(noisePos + vec3(20.0)) * noiseAmp;

    // Mouse interaction (repulsion/attraction network)
    float dist = distance(pos, uMouse);
    float interactionRadius = 3.0;
    if(dist < interactionRadius) {
       vec3 dir = normalize(pos - uMouse);
       // Push away slightly, but form a subtle ring/network around the mouse
       float force = (interactionRadius - dist) / interactionRadius;
       pos += dir * force * 1.2 * sin(uTime * 2.0 + dist * 5.0);

       // Highlight color when interacting
       vColor = mix(vColor, vec3(0.2, 1.0, 0.8), force * 0.8);
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Size attenuation based on distance
    gl_PointSize = aSize * (15.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  varying vec3 vColor;

  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    // Softer glow for particles
    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
    gl_FragColor = vec4(vColor, alpha * 0.8);
  }
`;

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const particlesCount = 4000;

  const [{ positions, colors, sizes }] = useState(() => {
    const pos = new Float32Array(particlesCount * 3);
    const col = new Float32Array(particlesCount * 3);
    const sz = new Float32Array(particlesCount);

    const colorEmerald = new THREE.Color('#34d399');
    const colorGold = new THREE.Color('#fbbf24');
    const colorCyan = new THREE.Color('#22d3ee');

    for(let i = 0; i < particlesCount; i++) {
      // Distribute particles in a shell around the Earth (radius > 2.0)
      // Make distribution more ring-like to simulate orbital networks
      const radius = 2.2 + Math.pow(Math.random(), 3) * 3.0;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;

      // Flatten the poles slightly to create an orbital belt
      pos[i*3] = radius * Math.sin(theta) * Math.cos(phi);
      pos[i*3+1] = radius * Math.sin(theta) * Math.sin(phi) * 0.5;
      pos[i*3+2] = radius * Math.cos(theta);

      const mixedColor = new THREE.Color();
      const rand = Math.random();

      if (rand < 0.5) {
          mixedColor.copy(colorEmerald).lerp(colorCyan, Math.random());
      } else if (rand < 0.9) {
          mixedColor.copy(colorGold).lerp(colorEmerald, Math.random() * 0.5);
      } else {
          mixedColor.copy(new THREE.Color(1, 1, 1)); // Bright nodes
      }

      col[i*3] = mixedColor.r;
      col[i*3+1] = mixedColor.g;
      col[i*3+2] = mixedColor.b;

      sz[i] = 1.0 + Math.random() * 4.0;
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

        const vector = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5);
        vector.unproject(state.camera);
        const dir = vector.sub(state.camera.position).normalize();
        const distance = -state.camera.position.z / dir.z;
        const pos = state.camera.position.clone().add(dir.multiplyScalar(distance));

        materialRef.current.uniforms.uMouse.value.lerp(pos, 0.1); // Faster tracking for particles
    }
    if (pointsRef.current) {
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
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

function SceneController() {
    const groupRef = useRef<THREE.Group>(null);
    const pointer = useRef(new THREE.Vector2());
    const targetPointer = useRef(new THREE.Vector2());

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
            const scrollY = window.scrollY;
            const scrollNormalized = Math.min(scrollY / (document.body.scrollHeight - window.innerHeight || 1), 1.0);

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
            <ProceduralEarth />
            <Particles />
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