import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/** Custom wavy circular torus curve */
class WavyInfinityCurve extends THREE.Curve<THREE.Vector3> {
    constructor(radius = 1.8, amplitude = 0.4, waves = 2, phase = 0) {
        super();
        this.radius = radius;
        this.amplitude = amplitude;
        this.waves = waves;
        this.phase = phase;
    }

    getPoint(t) {
        const theta = t * Math.PI * 2;
        const R = this.radius;
        const A = this.amplitude;
        const k = this.waves;
        const φ = this.phase;

        return new THREE.Vector3(
            R * Math.cos(theta),
            A * Math.sin(k * theta + φ),
            R * Math.sin(theta)
        );
    }
}

const COLORS = [
    "#ffd45a", // gold
    "#ff7b00", // orange
    "#ff00aa", // magenta/pink
    "#7a2cff", // deep violet
    "#00e5ff", // electric cyan
    "#43ff7a", // green-teal
];

// Starfield background component
export const Starfield = () => {
    const points = useMemo(() => {
        const particles = new Float32Array(2000 * 3);
        for (let i = 0; i < 2000; i++) {
            const i3 = i * 3;
            const radius = 15 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            particles[i3] = radius * Math.sin(phi) * Math.cos(theta);
            particles[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            particles[i3 + 2] = radius * Math.cos(phi);
        }
        return particles;
    }, []);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[points, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                color="#ffffff"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
};

// Radial glow background
export const RadialGlow = () => {
    return (
        <mesh position={[0, 0, -5]}>
            <planeGeometry args={[30, 30]} />
            <meshBasicMaterial
                color="#8b4d9e"
                transparent
                opacity={0.15}
            />
        </mesh>
    );
};

export const InfinityWavyTorus = () => {
    const group = useRef();
    const timeRef = useRef(0);

    useFrame((state, delta) => {
        if (group.current) {
            group.current.rotation.y += 0.003;
            group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
            timeRef.current += delta;
        }
    });

    return (
        <group ref={group}>
            {COLORS.map((color, i) => {
                const bundleTightness = 0.018;
                const radialOffset = (i - (COLORS.length - 1) / 2) * bundleTightness;

                const tubeRadius = 0.08 + i * 0.01;
                const baseAmplitude = 0.45 + i * 0.03;
                const wobble = 0.08;

                const amplitude =
                    baseAmplitude + Math.sin(timeRef.current * 0.8 + i * 0.7) * wobble;

                const phaseShift =
                    i * 0.2 + Math.sin(timeRef.current * 0.6 + i) * wobble;

                return (
                    <mesh
                        key={i}
                        scale={[
                            1 - Math.abs(i - COLORS.length / 2) * 0.05,
                            1 - Math.abs(i - COLORS.length / 2) * 0.05,
                            1 - Math.abs(i - COLORS.length / 2) * 0.05
                        ]}
                    >
                        <tubeGeometry
                            args={[
                                new WavyInfinityCurve(
                                    1.6 + radialOffset,
                                    amplitude,
                                    2,
                                    phaseShift
                                ),
                                400,
                                tubeRadius,
                                32,
                                true
                            ]}
                        />
                        <meshPhysicalMaterial
                            color={new THREE.Color(color)}
                            emissive={new THREE.Color(color)}
                            emissiveIntensity={2.0}
                            roughness={0.15}
                            metalness={0.5}
                            transparent={true}
                            opacity={0.92}
                            transmission={0.25}
                            thickness={0.6}
                            clearcoat={0.8}
                            clearcoatRoughness={0.15}
                        />
                    </mesh>
                );
            })}
        </group>
    );
};

