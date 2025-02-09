"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { createNoise4D } from "simplex-noise"

const noise4D = createNoise4D()

function Blob() {
	const meshRef = useRef<THREE.Mesh>(null)
	const geometryRef = useRef<THREE.SphereGeometry>(null)
	const materialRef = useRef<THREE.ShaderMaterial>(null)

	const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normal;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

	const fragmentShader = `
    uniform float time;
    varying vec3 vNormal;
    varying vec3 vPosition;

    // Updated colors to create a more unique palette
    // Rich purple, teal, and gold accents
    vec3 colorA = vec3(0.58, 0.345, 0.698); // Purple
    vec3 colorB = vec3(0.196, 0.796, 0.745); // Teal
    vec3 colorC = vec3(0.898, 0.765, 0.396); // Gold

    void main() {
      vec3 color = colorA;
      color += colorB * cos(vPosition.x * 2.0 + time * 0.5);
      color += colorC * sin(vPosition.y * 2.0 + time * 0.3);

      color = normalize(color);

      gl_FragColor = vec4(color, 1.0);
    }
  `

	const uniforms = useMemo(
		() => ({
			time: { value: 0 },
		}),
		[],
	)

	const positionArray = useMemo(() => {
		const geometry = new THREE.SphereGeometry(1, 128, 128)
		return geometry.attributes.position.array
	}, [])

	useFrame(({ clock }) => {
		if (!geometryRef.current || !materialRef.current) return

		const time = clock.getElapsedTime() * 0.5 // Slightly faster animation (was 0.2)
		const positions = geometryRef.current.attributes.position.array as Float32Array

		for (let i = 0; i < positions.length; i += 3) {
			const x = positionArray[i]
			const y = positionArray[i + 1]
			const z = positionArray[i + 2]

			// Smoother noise calculation
			const frequency = 0.8
			const amplitude = 0.3
			const noise = noise4D(x * frequency, y * frequency, z * frequency, time * 0.3) * amplitude

			// Apply smooth step function for rounded edges
			const smoothNoise = THREE.MathUtils.smoothstep(noise, -amplitude, amplitude)
			const newRadius = 1 + smoothNoise

			positions[i] = x * newRadius
			positions[i + 1] = y * newRadius
			positions[i + 2] = z * newRadius
		}

		geometryRef.current.attributes.position.needsUpdate = true
		geometryRef.current.computeVertexNormals()

		if (meshRef.current) {
			meshRef.current.rotation.y += 0.0015 // Slightly faster rotation (was 0.001)
			meshRef.current.rotation.z += 0.001 // Slightly faster rotation (was 0.0005)
		}

		// Update shader uniform
		materialRef.current.uniforms.time.value = time
	})

	return (
		<mesh ref={meshRef}>
			<sphereGeometry ref={geometryRef} args={[1, 128, 128]} />
			<shaderMaterial
				ref={materialRef}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				uniforms={uniforms}
				wireframe
				wireframeLinewidth={1.5}
			/>
		</mesh>
	)
}

export default function BlobScene() {
	return (
		<div className="w-full h-screen bg-black">
			<Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
				<ambientLight intensity={0.5} />
				<pointLight position={[10, 10, 10]} intensity={1} />
				<Blob />
				<OrbitControls enableZoom={false} />
			</Canvas>
		</div>
	)
}

