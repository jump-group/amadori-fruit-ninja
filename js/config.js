/**
 * Configurazione del gioco Fruit Ninja
 * Contiene tutte le costanti e impostazioni globali
 */

const GameConfig = {
    // Oggetti di gioco
    fruits: ['bean', 'chicken', 'egg', 'pig'],
    
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
        bean: 'images/elements/bean.png',
        chicken: 'images/elements/chicken.png',
        egg: 'images/elements/egg.png',
        pig: 'images/elements/pig.png',
        bomb: 'images/elements/dinamite.png',
        explosion: 'images/explosion.png',
        start: 'images/start.png',
        game: 'images/game.png',
        over: 'images/over.png'
    },
    
    // Spritesheets per animazioni
    spritesheets: {
        sliceExplosion: {
            path: 'images/spritesheets/dinamite.png',
            frameWidth: 512,
            frameHeight: 512,
            frameCount: 8
        }
    },
    
    // Configurazione animazione esplosione
    sliceAnimation: {
        frameRate: 24,
        scale: 0.4
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
