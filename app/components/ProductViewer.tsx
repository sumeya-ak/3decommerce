'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { ColorPicker } from './ColorPicker';
import { PauseIcon, PlayIcon } from './icons';

const Model = ({ color }: { color: string }) => {
  return (
    <mesh castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export const ProductViewer = () => {
  const [color, setColor] = useState('#2c5282');
  const [isRotating, setIsRotating] = useState(true);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg">
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <Model color={color} />
          </Stage>
          <OrbitControls 
            autoRotate={isRotating}
            autoRotateSpeed={2}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <ColorPicker currentColor={color} onColorChange={setColor} />
      </div>

      <motion.button
        className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-full"
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsRotating(!isRotating)}
      >
        {isRotating ? (
          <PauseIcon className="w-6 h-6" />
        ) : (
          <PlayIcon className="w-6 h-6" />
        )}
      </motion.button>
    </div>
  );
}; 