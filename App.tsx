
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { ChristmasTree } from './components/ChristmasTree';
import { Overlay } from './components/Overlay';
import { Loader } from './components/Loader';
import { TreeMorphState } from './types';

const App: React.FC = () => {
  const [activeColor, setActiveColor] = useState<string>('#D4AF37'); // Default to Gold for stardust feel
  const [morphState, setMorphState] = useState<TreeMorphState>(TreeMorphState.TREE_SHAPE);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Suspense fallback={<Loader />}>
        <Canvas gl={{ antialias: false, alpha: true }}>
          <color attach="background" args={['#000000']} />
          
          <PerspectiveCamera makeDefault position={[0, 1, 15]} fov={30} />
          
          {/* Subtle atmospheric lighting */}
          <ambientLight intensity={0.1} />
          <pointLight position={[0, 5, 0]} intensity={1.5} color={activeColor} />
          <pointLight position={[5, -2, 5]} intensity={0.5} color="#444" />

          <Environment preset="night" />

          {/* The Particle Spiral Tree */}
          <ChristmasTree color={activeColor} morphState={morphState} />

          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
          
          <OrbitControls 
            enablePan={false} 
            minDistance={10} 
            maxDistance={25} 
            autoRotate 
            autoRotateSpeed={0.8} 
          />

          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={0.2} 
              mipmapBlur 
              intensity={2.5} 
              radius={0.6} 
            />
            <Noise opacity={0.08} />
            <Vignette eskil={false} offset={0.1} darkness={1.2} />
          </EffectComposer>
        </Canvas>
      </Suspense>

      <Overlay 
        onColorChange={setActiveColor} 
        morphState={morphState}
        onMorphToggle={() => setMorphState(prev => prev === TreeMorphState.TREE_SHAPE ? TreeMorphState.SCATTERED : TreeMorphState.TREE_SHAPE)}
      />
    </div>
  );
};

export default App;
