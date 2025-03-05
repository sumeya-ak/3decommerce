import { motion } from 'framer-motion';
import { ProductViewer } from './ProductViewer';

interface ProductCardProps {
    name: string;
    price: number;
    description: string;
    modelPath: string;
}

export const ProductCard = ({ name, price, description, modelPath }: ProductCardProps) => {
    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ProductViewer modelPath={modelPath} />
                
                <div className="space-y-6">
                    <motion.h1 
                        className="text-4xl font-bold text-gray-900"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {name}
                    </motion.h1>
                    
                    <motion.p 
                        className="text-2xl font-semibold text-blue-600"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        ${price.toFixed(2)}
                    </motion.p>
                    
                    <motion.p 
                        className="text-gray-600"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {description}
                    </motion.p>
                    
                    <motion.div 
                        className="space-x-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Add to Cart
                        </button>
                        <button className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
                            View Details
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}; 