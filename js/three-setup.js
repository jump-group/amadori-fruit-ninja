/**
 * Gestione Three.js per i modelli 3D
 * Handles: scena, camera, renderer, caricamento modelli
 */

const ThreeManager = (function() {
    // Private variables
    let scene = null;
    let camera = null;
    let renderer = null;
    let model = null;
    let modelLoaded = false;
    let currentFruit = null;
    let spinDirection = 1;
    
    const config = window.GameConfig.three;
    
    /**
     * Inizializza la scena Three.js
     */
    function init() {
        // Create scene
        scene = new THREE.Scene();
        
        // Create camera
        camera = new THREE.PerspectiveCamera(
            config.cameraFOV,
            window.innerWidth / window.innerHeight,
            config.cameraNear,
            config.cameraFar
        );
        camera.position.z = config.cameraZ;
        
        // Create renderer with transparent background
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.pointerEvents = 'none';
        renderer.domElement.style.zIndex = '10';
        document.body.appendChild(renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, config.ambientLightIntensity);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, config.directionalLightIntensity);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);
        
        // Load GLB model
        loadModel();
        
        // Listen for resize
        window.addEventListener('resize', onWindowResize);
    }
    
    /**
     * Carica il modello 3D GLB
     */
    function loadModel() {
        const loader = new THREE.GLTFLoader();
        loader.load(
            window.GameConfig.assets.model3D,
            function(gltf) {
                model = gltf.scene;
                model.scale.set(config.modelInitialScale, config.modelInitialScale, config.modelInitialScale);
                model.visible = false;
                scene.add(model);
                modelLoaded = true;
                console.log('3D model loaded successfully!');
            },
            undefined,
            function(error) {
                console.error('Error loading 3D model:', error);
            }
        );
    }
    
    /**
     * Aggiorna la scena Three.js (chiamato ogni frame)
     */
    function update() {
        if (!renderer) return;
        
        // Spin del modello
        if (model && model.visible) {
            model.rotation.z += config.spinSpeed * spinDirection;
        }
        
        renderer.render(scene, camera);
    }
    
    /**
     * Converte coordinate schermo in coordinate mondo 3D
     * @param {number} screenX - Coordinata X sullo schermo
     * @param {number} screenY - Coordinata Y sullo schermo
     * @returns {Object} Coordinate {x, y, z} nel mondo 3D
     */
    function screenToWorld(screenX, screenY) {
        const x = (screenX / window.innerWidth) * 2 - 1;
        const y = -(screenY / window.innerHeight) * 2 + 1;
        
        // Scale to match visible area at z=0
        const visibleHeight = 2 * Math.tan((config.cameraFOV * Math.PI / 180) / 2) * config.cameraZ;
        const visibleWidth = visibleHeight * (window.innerWidth / window.innerHeight);
        
        return {
            x: x * visibleWidth / 2,
            y: y * visibleHeight / 2,
            z: 0
        };
    }
    
    /**
     * Gestisce il resize della finestra
     */
    function onWindowResize() {
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    
    /**
     * Associa il modello 3D a uno sprite Phaser
     * @param {Object} sprite - Lo sprite Phaser da seguire
     * @param {number} fruitSize - Dimensione del frutto per scalare il modello
     */
    function attachToSprite(sprite, fruitSize) {
        if (!modelLoaded || !model) return;
        
        currentFruit = sprite;
        sprite.alpha = 0; // Hide 2D placeholder
        model.visible = true;
        
        // Reset rotation - face towards screen
        model.rotation.x = Math.PI / 2;
        model.rotation.y = 0;
        model.rotation.z = 0;
        
        // Random spin direction
        spinDirection = Math.random() > 0.5 ? 1 : -1;
        
        // Scale model
        const modelScale = fruitSize / 4;
        model.scale.set(modelScale, modelScale, modelScale);
    }
    
    /**
     * Aggiorna la posizione del modello 3D per seguire lo sprite
     * @param {Object} sprite - Lo sprite da seguire
     */
    function updatePosition(sprite) {
        if (!sprite || !sprite.alive || !model) return;
        
        const pos3D = screenToWorld(sprite.x, sprite.y);
        model.position.set(pos3D.x, pos3D.y, pos3D.z);
    }
    
    /**
     * Nasconde il modello 3D
     */
    function hideModel() {
        if (model) {
            model.visible = false;
        }
        currentFruit = null;
    }
    
    /**
     * Verifica se il modello è caricato
     * @returns {boolean}
     */
    function isModelLoaded() {
        return modelLoaded;
    }
    
    /**
     * Ottiene il frutto corrente associato al modello 3D
     * @returns {Object|null}
     */
    function getCurrentFruit() {
        return currentFruit;
    }
    
    // Public API
    return {
        init,
        update,
        attachToSprite,
        updatePosition,
        hideModel,
        isModelLoaded,
        getCurrentFruit,
        screenToWorld
    };
})();

// Export per uso globale
window.ThreeManager = ThreeManager;
