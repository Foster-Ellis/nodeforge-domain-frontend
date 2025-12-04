import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/** Custom wavy circular torus curve */
class WavyInfinityCurve extends THREE.Curve<THREE.Vector3> {
    radius: number;
    amplitude: number;
    waves: number;
    phase: number;

    constructor(radius = 1.8, amplitude = 0.4, waves = 2, phase = 0) {
        super();
        this.radius = radius;
        this.amplitude = amplitude;
        this.waves = waves;
        this.phase = phase; // << new
    }

    getPoint(t: number) {
        const theta = t * Math.PI * 2;
        const R = this.radius;
        const A = this.amplitude;
        const k = this.waves;
        const φ = this.phase;

        return new THREE.Vector3(
            R * Math.cos(theta),
            A * Math.sin(k * theta + φ), // << apply phase here
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


export const InfinityWavyTorus = () => {
    const group = useRef<THREE.Group>(null);
    const timeRef = useRef(0);

    useFrame((state, delta) => {
        if (group.current) {
            group.current.rotation.y += 0.002;

            // advance internal time for wobble animation
            timeRef.current += delta;
        }
    });


    return (
        <group ref={group}>
            {COLORS.map((color, i) => {
                const bundleTightness = 0.015; // tighter bundle
                const radialOffset = (i - (COLORS.length - 1) / 2) * bundleTightness;

                // Tube variations for organic bundle look
                const tubeRadius = 0.05 + i * 0.007;              // slight size difference
                const baseAmplitude = 0.45 + i * 0.03;
                const wobble = 0.08; // amount of movement

                const amplitude =
                    baseAmplitude + Math.sin(timeRef.current * 0.8 + i * 0.7) * wobble;

                const phaseShift =
                    i * 0.2 + Math.sin(timeRef.current * 0.6 + i) * wobble;
                // slight phase variation

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
                                    phaseShift // <-- use your per-tube phase shift here
                                ),
                                400,
                                tubeRadius,
                                32,
                                true
                            ]}
                        />
                        <meshPhysicalMaterial
                            color={new THREE.Color(color)}
                            emissive={new THREE.Color(color).offsetHSL(i * 0.05, 0.25, 0)}
                            emissiveIntensity={2.2}
                            roughness={0.15}
                            metalness={0.6}
                            sheen={1.0}
                            sheenRoughness={0.4}
                            clearcoat={1.0}
                            clearcoatRoughness={0.1}
                            transparent={true}
                            opacity={0.95}
                            thickness={0.5}
                            transmission={0.2}
                        />

                    </mesh>
                );

            })}

        </group>
    );
};
