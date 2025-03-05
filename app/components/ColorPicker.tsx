import { motion } from 'framer-motion';

const colors = [
    { name: 'Classic Blue', hex: '#2c5282' },
    { name: 'Racing Red', hex: '#e53e3e' },
    { name: 'Forest Green', hex: '#38a169' },
    { name: 'Midnight Black', hex: '#1a202c' },
    { name: 'Royal Purple', hex: '#6b46c1' },
];

interface ColorPickerProps {
    currentColor: string;
    onColorChange: (color: string) => void;
}

export const ColorPicker = ({ currentColor, onColorChange }: ColorPickerProps) => {
    return (
        <div className="flex gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            {colors.map((color) => (
                <motion.button
                    key={color.hex}
                    className={`w-8 h-8 rounded-full border-2 ${
                        currentColor === color.hex ? 'border-gray-800' : 'border-white'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onColorChange(color.hex)}
                    title={color.name}
                />
            ))}
        </div>
    );
}; 