import * as THREE from "three";

export class BraidCurve extends THREE.Curve<THREE.Vector3> {
    majorRadius: number;
    minorRadius: number;
    numTwists: number;
    strandOffset: number;

    constructor(
        majorRadius: number,
        minorRadius: number,
        numTwists: number,
        strandOffset: number
    ) {
        super();
        this.majorRadius = majorRadius;
        this.minorRadius = minorRadius;
        this.numTwists = numTwists;
        this.strandOffset = strandOffset;
    }

    getPoint(t: number, target = new THREE.Vector3()) {
        const θ = t * Math.PI * 2;
        const twist = this.numTwists * θ + this.strandOffset;

        const x =
            (this.majorRadius + this.minorRadius * Math.cos(twist)) * Math.cos(θ);

        const z =
            (this.majorRadius + this.minorRadius * Math.cos(twist)) * Math.sin(θ);

        const y = this.minorRadius * Math.sin(twist);

        return target.set(x, y, z);
    }
}
