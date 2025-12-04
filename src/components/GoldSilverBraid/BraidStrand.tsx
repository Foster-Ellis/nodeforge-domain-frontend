import { useMemo } from "react";
import * as THREE from "three";
import { BraidCurve } from "./BraidCurve";


type BraidStrandProps = JSX.IntrinsicElements["mesh"] & {
    color: THREE.ColorRepresentation;
    majorRadius: number;
    minorRadius: number;
    numTwists: number;
    strandOffset: number;
    tubeRadius: number;
    tubularSegments: number;
    radialSegments: number;
};



export function BraidStrand({
    color,
    majorRadius,
    minorRadius,
    numTwists,
    strandOffset,
    tubeRadius,
    tubularSegments,
    radialSegments,
    ...props
}: BraidStrandProps) {
    const curve = useMemo(
        () =>
            new BraidCurve(
                majorRadius,
                minorRadius,
                numTwists,
                strandOffset
            ),
        [majorRadius, minorRadius, numTwists, strandOffset]
    );

    const geometry = useMemo(
        () =>
            new THREE.TubeGeometry(
                curve,
                tubularSegments,
                tubeRadius,
                radialSegments,
                true
            ),
        [curve, tubularSegments, tubeRadius, radialSegments]
    );

    const material = useMemo(
        () =>
            new THREE.MeshPhysicalMaterial({
                color,
                metalness: 1,
                roughness: 0.05,
                reflectivity: 1,
                clearcoat: 1,
                clearcoatRoughness: 0.1,
                ior: 1.55,
            }),
        [color]
    );

    return (
        <mesh geometry={geometry} material={material} {...props} />
    );
}
