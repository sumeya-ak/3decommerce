import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class ProductViewer {
    constructor() {
        this.container = document.getElementById('product-viewer');
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
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);
        
        // Set scene properties
        this.scene.background = new THREE.Color(0xf8f9fa);
        
        // Initialize clock for animations
        this.clock = new THREE.Clock();
        
        // Enhanced camera settings
        this.camera.position.set(0, 2, 5);
        
        // Add lights
        this.setupLights();
        
        // Add controls - Fix OrbitControls usage
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
        
        // Create example geometry (replace this with your 3D model)
        this.createDemoProduct();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start animation loop
        this.animate();
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
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(10, 10, 10);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        this.scene.add(mainLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);
        
        // Add spotlight for dramatic effect
        const spotlight = new THREE.SpotLight(0xffffff, 0.7);
        spotlight.position.set(0, 10, 0);
        spotlight.angle = Math.PI / 4;
        spotlight.penumbra = 0.1;
        spotlight.decay = 2;
        spotlight.distance = 200;
        spotlight.castShadow = true;
        this.scene.add(spotlight);
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
    
    createDemoProduct() {
        // Create a more complex demo product (sneaker-like shape)
        const group = new THREE.Group();
        
        // Base/Sole
        const sole = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.3, 1.2),
            new THREE.MeshPhongMaterial({ 
                color: 0x2c5282,
                shininess: 30
            })
        );
        sole.castShadow = true;
        sole.receiveShadow = true;
        
        // Upper part
        const upper = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 1.2, 1),
            new THREE.MeshPhongMaterial({ 
                color: 0x2c5282,
                shininess: 30
            })
        );
        upper.position.y = 0.75;
        upper.castShadow = true;
        upper.receiveShadow = true;
        
        // Add details
        const details = new THREE.Mesh(
            new THREE.TorusGeometry(0.3, 0.1, 16, 100),
            new THREE.MeshPhongMaterial({ 
                color: 0xffffff,
                shininess: 50
            })
        );
        details.rotation.x = Math.PI / 2;
        details.position.set(0, 0.8, 0.5);
        details.castShadow = true;
        
        group.add(sole);
        group.add(upper);
        group.add(details);
        
        // Position the entire group
        group.position.y = 1;
        
        this.product = group;
        this.scene.add(this.product);
    }
    
    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        });
        
        // Reset view button
        document.getElementById('reset-view').addEventListener('click', () => {
            this.resetView();
        });
        
        // Add to cart button
        document.getElementById('add-to-cart').addEventListener('click', () => {
            alert('Product added to cart!');
        });
    }
    
    resetView() {
        this.camera.position.set(0, 0, 5);
        this.controls.reset();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        // Update controls
        this.controls.update();
        
        // Update animations
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        // Add floating animation
        if (this.product) {
            this.product.position.y = Math.sin(Date.now() * 0.001) * 0.1 + 0.5;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the viewer when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new ProductViewer();
}); 