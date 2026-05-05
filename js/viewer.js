import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 🥽 NEW: Import the official Three.js VR Button
import { VRButton } from 'three/addons/webxr/VRButton.js'; 

const phaseFiles = {
    0: './phase1.glb',
    1: './phase2.glb',
    2: './phase3.glb',
    3: './phase4.glb',
    4: './phase5.glb'
};

// Model tilt setting
const phaseSettings = {
    0: { tiltX: 0, tiltZ: 20 },   // Phase 1 (Dialed in to 15 degrees to level it out!)
    1: { tiltX: 0, tiltZ: 0 },    
    2: { tiltX: 0, tiltZ: 0 },    
    3: { tiltX: 0, tiltZ: 0 },   // Phase 4
    4: { tiltX: 0, tiltZ: 0 }     // Phase 5
};

export function initViewer(containerId, config) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. Scene & Background (Sky only!)
    const scene = new THREE.Scene();
    const skyColor = 0x8A9A9E; 
    scene.background = new THREE.Color(skyColor); 
    scene.fog = new THREE.Fog(skyColor, 40, 600); 

    // 2. Camera & Renderer
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // 🎬 Enable Cinematic Shadows on the renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft, realistic shadow edges
    
    // 🥽 Tell the renderer to allow VR
    renderer.xr.enabled = true; 
    
    //  GLUE THE CANVAS TO THE SCREEN!
    container.appendChild(renderer.domElement);

    //  Inject the "Enter VR" button and force it to the Top Center!
    const vrBtn = VRButton.createButton(renderer);
    vrBtn.style.bottom = 'auto'; // Disables the default bottom positioning
    vrBtn.style.top = '80px';    // Pushed down slightly so it doesn't overlap the audio button!
    vrBtn.style.zIndex = '999';  // Makes sure it stays on top of the 3D canvas
    document.body.appendChild(vrBtn);

    // 3. Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const sunLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    sunLight.position.set(50, 80, 40);
    
    // 🎬 Tell the sun to cast shadows
    sunLight.castShadow = true;
    // Widen the shadow camera so it covers the whole diorama
    sunLight.shadow.camera.top = 150;
    sunLight.shadow.camera.bottom = -150;
    sunLight.shadow.camera.left = -150;
    sunLight.shadow.camera.right = 150;
    sunLight.shadow.mapSize.width = 2048; // High-res shadows
    sunLight.shadow.mapSize.height = 2048;
    
    scene.add(sunLight);

    // 4.  MOVING FOG SYSTEM 
    const fogCanvas = document.createElement('canvas');
    fogCanvas.width = 256;
    fogCanvas.height = 256;
    const fogContext = fogCanvas.getContext('2d');
    const fogGradient = fogContext.createRadialGradient(128, 128, 0, 128, 128, 128);
    fogGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)'); 
    fogGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');   
    fogContext.fillStyle = fogGradient;
    fogContext.fillRect(0, 0, 256, 256);
    const fogTexture = new THREE.CanvasTexture(fogCanvas);

    const fogGeometry = new THREE.BufferGeometry();
    const fogCount = 80; 
    const fogPositions = new Float32Array(fogCount * 3);
    for(let i = 0; i < fogCount; i++) {
        fogPositions[i*3] = (Math.random() - 0.5) * 200;     
        fogPositions[i*3+1] = (Math.random() - 0.5) * 50;     
        fogPositions[i*3+2] = (Math.random() - 0.5) * 200;     
    }
    fogGeometry.setAttribute('position', new THREE.BufferAttribute(fogPositions, 3));
    
    const fogMaterial = new THREE.PointsMaterial({
        size: 50, map: fogTexture, transparent: true, opacity: 0.5,
        depthWrite: false, blending: THREE.NormalBlending, color: 0xcad6d9 
    });
    
    const movingFog = new THREE.Points(fogGeometry, fogMaterial);
    scene.add(movingFog);

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    //  Enable elegant Auto-Rotation
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8; // Nice, slow museum spin

    // 6. Load the 3D Model
    const loader = new GLTFLoader();
    const modelUrl = phaseFiles[config.phaseIndex];

    if (modelUrl) {
        loader.load(
            modelUrl, 
            (gltf) => {
                const model = gltf.scene;
                
                // 🎬 Loop through the model and tell the rocks/grass to cast & receive shadows
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                
                // A. Apply the Tilt Fix
                const settings = phaseSettings[config.phaseIndex] || { tiltX: 0, tiltZ: 0 };
                model.rotation.x = settings.tiltX * (Math.PI / 180);
                model.rotation.z = settings.tiltZ * (Math.PI / 180);

                scene.add(model);

                // B. Auto-Frame
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                controls.target.copy(center);
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 2.2; 

                camera.position.set(center.x, center.y + (maxDim / 3), center.z + cameraZ);
                camera.updateProjectionMatrix();
                controls.update();

                // C. Nuke Loading Text
                const loadingScreens = [
                    document.getElementById('loading'), document.getElementById('status'),
                    document.getElementById('loading-screen'), document.querySelector('.loading')
                ];
                loadingScreens.forEach(el => { if (el) el.style.display = 'none'; });
            }, 
            (xhr) => { console.log(`Loading: ${Math.round((xhr.loaded / xhr.total) * 100)}%`); },
            (error) => { console.error('Error loading model:', error); }
        );
    }

    // 7. Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 8.  Updated Animation Loop (VR Requires 'setAnimationLoop')
    renderer.setAnimationLoop(function () {
        controls.update(); // This keeps the auto-rotate spinning!
        if (movingFog) movingFog.rotation.y += 0.001; 
        renderer.render(scene, camera);
    });
}
