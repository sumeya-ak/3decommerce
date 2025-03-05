import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ProductViewer {
    constructor(productId) {
        this.productId = productId;
        this.container = document.getElementById('product-viewer');
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.container.appendChild(this.renderer.domElement);

        // Set scene properties
        this.scene.background = new THREE.Color(0xf8f9fa);
        
        // Initialize clock for animations
        this.clock = new THREE.Clock();
        
        // Set up camera
        this.camera.position.set(0, 2, 5);

        // Add lights
        this.setupLights();

        // Add controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 10;
        this.controls.minDistance = 2;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1.0;
        this.controls.maxPolarAngle = Math.PI / 1.8;
        this.controls.minPolarAngle = Math.PI / 3;

        // Add floor
        this.addFloor();
        
        // Setup color options
        this.setupColorOptions();
        
        // Add loading manager
        this.setupLoadingManager();
        
        // Initialize animation mixer
        this.mixer = null;
        this.animations = [];

        // Load the appropriate 3D model based on productId
        this.loadModel();

        // Setup event listeners
        this.setupEventListeners();

        // Animation
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    setupLoadingManager() {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = `
            <div class="loader"></div>
            <p>Loading 3D Model...</p>
        `;
        this.container.appendChild(loadingScreen);

        this.loadingManager = new THREE.LoadingManager();
        this.loadingManager.onProgress = (url, loaded, total) => {
            const progress = (loaded / total * 100);
            // Update loading progress if needed
        };
        
        this.loadingManager.onLoad = () => {
            loadingScreen.style.display = 'none';
        };
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    addFloor() {
        const floorGeometry = new THREE.CircleGeometry(20, 32);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.7,
            metalness: 0.1
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotateX(-Math.PI / 2);
        floor.receiveShadow = true;
        this.scene.add(floor);
    }
    
    setupColorOptions() {
        const colorOptions = document.createElement('div');
        colorOptions.className = 'color-options';
        const colors = [
            { name: 'Classic Blue', hex: '#2c5282' },
            { name: 'Racing Red', hex: '#e53e3e' },
            { name: 'Forest Green', hex: '#38a169' },
            { name: 'Midnight Black', hex: '#1a202c' }
        ];
        
        colors.forEach(color => {
            const button = document.createElement('button');
            button.style.backgroundColor = color.hex;
            button.title = color.name;
            button.onclick = () => this.changeProductColor(color.hex);
            colorOptions.appendChild(button);
        });
        
        this.container.appendChild(colorOptions);
    }
    
    changeProductColor(hexColor) {
        if (this.product) {
            this.product.traverse((child) => {
                if (child.isMesh && child !== this.product) {
                    child.material.color.setStyle(hexColor);
                }
            });
        }
    }

    loadModel() {
        const modelPaths = {
            'sneaker': '/models/sneaker.glb',
            'watch': '/models/watch.glb',
            'headphones': '/models/headphones.glb'
        };

        const modelPath = modelPaths[this.productId];
        if (!modelPath) {
            console.error('No model found for product:', this.productId);
            return;
        }

        const loader = new GLTFLoader();
        loader.load(modelPath, (gltf) => {
            this.product = gltf.scene;
            this.scene.add(this.product);
            
            // Center and scale the model
            const box = new THREE.Box3().setFromObject(this.product);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2 / maxDim;
            this.product.scale.setScalar(scale);
            
            this.product.position.sub(center.multiplyScalar(scale));
            
            // Hide loading screen
            const loadingScreen = this.container.querySelector('.loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        });
    }

    setupEventListeners() {
        // Reset view button
        document.getElementById('reset-view').addEventListener('click', () => {
            this.resetView();
        });
        
        // Add to cart button
        document.getElementById('add-to-cart').addEventListener('click', () => {
            alert('Product added to cart!');
        });

        // Color buttons
        const colorButtons = document.querySelectorAll('.color-btn');
        colorButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active class from all buttons
                colorButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                // Change product color
                this.changeProductColor(e.target.dataset.color);
            });
        });
    }
    
    resetView() {
        this.camera.position.set(0, 0, 5);
        this.controls.reset();
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        if (this.product) {
            this.product.rotation.y += 0.01;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the viewer when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const viewer = new ProductViewer();
});

// Export the class if needed
export default ProductViewer; 