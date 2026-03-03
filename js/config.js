/**
 * Configurazione del gioco Fruit Ninja
 * Contiene tutte le costanti e impostazioni globali
 */

const GameConfig = {
    // Oggetti di gioco
    fruits: ['apple'],
    
    // Fisica e timing
    gravity: 300,
    fireRate: 1400,
    
    // Punteggio
    scoreToWin: 10,
    maxLeaderboardEntries: 5,
    
    // Colori
    backgroundColor: '#0d2622',
    slashColor: 0xFFFFFF,
    slashAlpha: 0.5,
    
    // Particelle
    particleLifespan: 2000,
    particleCount: 4,
    particleGravity: 300,
    particleScaleMin: 0.15,
    particleScaleMax: 0.3,
    particleSpeedY: 400,
    
    // Asset paths
    assets: {
        apple: 'images/fruits/apple.png',
        bomb: 'images/bomb.png',
        explosion: 'images/explosion.png',
        model3D: 'assets/models/spilla_amadori_1.glb'
    },
    
    // Three.js settings
    three: {
        cameraFOV: 75,
        cameraNear: 0.1,
        cameraFar: 1000,
        cameraZ: 5,
        ambientLightIntensity: 0.6,
        directionalLightIntensity: 0.8,
        modelInitialScale: 0.5,
        spinSpeed: 0.05
    }
};

/**
 * Calcola le dimensioni responsive basate sulle dimensioni dello schermo
 * @param {number} width - Larghezza dello schermo
 * @param {number} height - Altezza dello schermo
 * @returns {Object} Oggetto con fontSize e fruitSize
 */
function calculateResponsiveSizes(width, height) {
    const minDimension = Math.min(width, height);
    
    let fontSize;
    if (minDimension < 400) {
        fontSize = 18; // Small phones
    } else if (minDimension < 600) {
        fontSize = 24; // Large phones
    } else if (minDimension < 900) {
        fontSize = 32; // Tablets
    } else if (minDimension < 1200) {
        fontSize = 40; // Small desktop/totem
    } else {
        fontSize = Math.round(minDimension * 0.04); // Large screens/totem
    }
    
    // Fruit size scales with screen, min 80px, max 300px
    const fruitSize = Math.round(Math.min(Math.max(minDimension * 0.18, 80), 300));
    
    return { fontSize, fruitSize };
}

// Export per uso in altri moduli
window.GameConfig = GameConfig;
window.calculateResponsiveSizes = calculateResponsiveSizes;
