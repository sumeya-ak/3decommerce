'use client';

import { ProductViewer } from './components/ProductViewer';
import { ThemeToggle } from './components/ThemeToggle';

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <ThemeToggle />
            <div className="max-w-6xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ProductViewer />
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Premium Sneaker
                        </h1>
                        <p className="text-2xl font-semibold text-blue-600">
                            $199.99
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            Experience our latest sneaker in stunning 3D. Rotate, zoom, and explore every detail of this premium product. Featuring advanced cushioning technology and breathable materials for maximum comfort.
                        </p>
                        <div className="space-x-4">
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Add to Cart
                            </button>
                            <button className="px-6 py-3 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
} 