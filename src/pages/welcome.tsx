import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { InfinityWavyTorus } from "../components/InfinityWavyTorus";
//Starfield
//RadialGlow
const Welcome = () => {
    return (
        <div className="w-full h-screen bg-[#0d011f] flex items-center justify-center">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <color attach="background" args={["#050010"]} />
                <ambientLight intensity={0.5} />
                <InfinityWavyTorus />

                <EffectComposer>
                    <Bloom
                        intensity={0.5}
                        luminanceThreshold={0.1}
                        luminanceSmoothing={0.9}
                    />
                </EffectComposer>
            </Canvas>

        </div>
    );
};

export default Welcome;


