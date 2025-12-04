import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const COLORS = [
    "#00e5ff",
    "#ff00ff",
    "#ffa500",
    "#ff4dd2",
    "#66ccff",
];

export const InfinityTorus = () => {
    const group = useRef<THREE.Group>(null);

    useFrame(() => {
        if (group.current) {
            group.current.rotation.z += 0.01;
        }
    });

    return (
        <group rotation={[Math.PI / 2.2, 0, 0]} ref={group}>
            {COLORS.map((color, i) => {
                const offset = (i - (COLORS.length - 1) / 2) * 0.04;

                return (
                    <mesh key={i} position={[0, offset * 0.2, 0]}>
                        <torusGeometry args={[1.8, 0.08 + offset * 0.15, 256, 64]} />
                        <meshStandardMaterial
                            color={new THREE.Color(1, 1, 1)}
                            emissive={new THREE.Color(color)}
                            emissiveIntensity={2.5}
                            metalness={0.3}
                            roughness={0.2}
                        />
                    </mesh>
                );
            })}
        </group>
    );
};

