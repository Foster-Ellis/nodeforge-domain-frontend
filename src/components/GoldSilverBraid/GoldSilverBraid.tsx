import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Color } from "three";
import { BraidStrand } from "./BraidStrand";

export interface GoldSilverBraidProps {
    majorRadius?: number;
    minorRadius?: number;
    tubeRadius?: number;
    numTwists?: number;
    rotationSpeed?: number;
    segments?: number;
}

export default function GoldSilverBraid({
    majorRadius = 1.8,
    minorRadius = 0.22,
    tubeRadius = 0.07,
    numTwists = 9,
    rotationSpeed = 0.004,
    segments = 700,
}: GoldSilverBraidProps) {
    const group = useRef<Group>(null!);

    // Animate whole braid
    useFrame(() => {
        group.current.rotation.y += rotationSpeed;
    });

    const colors = [
        new Color("#FFD55A"), // gold
        new Color("#FFFFFF"), // silver
        new Color("#FFD55A"),
        new Color("#FFFFFF"),
        new Color("#FFD55A"),
        new Color("#FFFFFF"),
    ];

    return (
        <group ref={group}>
            {/* Self-contained lighting */}
            <ambientLight intensity={0.3} />
            <pointLight position={[4, 6, 4]} intensity={2.8} />
            <pointLight position={[-4, 3, -4]} intensity={2.5} />
            <pointLight position={[0, 10, 0]} intensity={3} />

            {colors.map((color, i) => (
                <BraidStrand
                    key={i}
                    color={color}
                    majorRadius={majorRadius}
                    minorRadius={minorRadius}
                    numTwists={numTwists}
                    tubeRadius={tubeRadius}
                    tubularSegments={segments}
                    radialSegments={48}
                    strandOffset={(i * Math.PI * 2) / 6}
                />
            ))}
        </group>
    );
}
