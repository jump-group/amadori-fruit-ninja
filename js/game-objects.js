/**
 * Gestione degli oggetti di gioco (frutti e bombe)
 * Handles: creazione gruppi, lancio oggetti, fisica
 */

const GameObjects = (function() {
    // Private variables
    let game = null;
    let goodObjects = null;
    let badObjects = null;
    let emitter = null;
    let nextFire = 0;
    let fruitSize = 100;
    
    // Dynamic difficulty values
    let currentFireRate = 1400;
    let currentBombChance = 0.3;
    let currentSpeedMultiplier = 1.0;
    
    const config = window.GameConfig;
    
    /**
     * Inizializza il modulo con il riferimento al game Phaser
     * @param {Object} phaserGame - Istanza del gioco Phaser
     */
    function init(phaserGame) {
        game = phaserGame;
    }
    
    /**
     * Crea un gruppo di sprite singoli
     * @param {Array} sprites - Array di nomi sprite
     * @returns {Object} Gruppo Phaser
     */
    function createGroup(sprites) {
        const group = game.add.group();
        group.enableBody = true;
        group.physicsBodyType = Phaser.Physics.ARCADE;
        sprites.forEach(sprite => {
            group.add(game.make.sprite(30000, 30000, sprite));
        });
        group.setAll('checkWorldBounds', true);
        group.setAll('outOfBoundsKill', true);
        return group;
    }
    
    /**
     * Crea un gruppo con multipli dello stesso sprite
     * @param {number} numItems - Numero di elementi
     * @param {string} sprite - Nome dello sprite
     * @returns {Object} Gruppo Phaser
     */
    function createGroupMultiple(numItems, sprite) {
        const group = game.add.group();
        group.enableBody = true;
        group.physicsBodyType = Phaser.Physics.ARCADE;
        group.createMultiple(numItems, sprite);
        group.setAll('checkWorldBounds', true);
        group.setAll('outOfBoundsKill', true);
        return group;
    }
    
    /**
     * Crea tutti i gruppi di oggetti e l'emitter
     */
    function createAllGroups() {
        goodObjects = createGroup(config.fruits);
        badObjects = createGroupMultiple(4, 'bomb');
        
        emitter = game.add.emitter(0, 0, 300);
        emitter.makeParticles('explosion');
        emitter.gravity = config.particleGravity;
        emitter.setScale(config.particleScaleMin, config.particleScaleMax, config.particleScaleMin, config.particleScaleMax);
        emitter.setYSpeed(-config.particleSpeedY, config.particleSpeedY);
    }
    
    /**
     * Imposta la dimensione dei frutti
     * @param {number} size - Dimensione in pixel
     */
    function setFruitSize(size) {
        fruitSize = size;
    }
    
    /**
     * Ottiene un elemento morto random da un gruppo
     * @param {Object} group - Gruppo Phaser
     * @returns {Object} Sprite morto
     */
    function getRandomDead(group) {
        const deadChildren = group.children.filter(e => !e.alive);
        let randIndex = Math.floor(Math.random() * deadChildren.length);
        randIndex = Math.min(randIndex, deadChildren.length - 1);
        return deadChildren[randIndex];
    }
    
    /**
     * Genera accelerazione angolare random
     * @returns {number} Valore tra -50 e 50
     */
    function getRandomAngularAcceleration() {
        return ((Math.random() * 2) - 1) * 50;
    }
    
    /**
     * Genera angolo di partenza random
     * @returns {number} Valore tra -10 e 10
     */
    function getRandomStartingAngle() {
        return ((Math.random() * 2) - 1) * 10;
    }
    
    /**
     * Genera posizione X random (60% centrale dello schermo)
     * @returns {number} Posizione X
     */
    function getRandomX() {
        return (((Math.random() * game.world.width) - game.world.centerX) * 0.6) + game.world.centerX;
    }
    
    /**
     * Genera velocità random
     * @returns {number} Velocità (minimo 500)
     */
    function getRandomSpeed() {
        return Math.max(Math.random() * game.world.height, 500) * currentSpeedMultiplier;
    }
    
    /**
     * Lancia un oggetto buono (frutto)
     */
    function throwGoodObject() {
        const obj = getRandomDead(goodObjects);
        obj.reset(getRandomX(), game.world.height);
        obj.anchor.setTo(0.5, 0.5);
        obj.angle = getRandomStartingAngle();
        obj.height = obj.width = fruitSize;
        obj.body.angularAcceleration = getRandomAngularAcceleration();
        game.physics.arcade.moveToXY(obj, game.world.centerX, game.world.centerY, getRandomSpeed());
    }
    
    /**
     * Lancia un oggetto cattivo (bomba)
     */
    function throwBadObject() {
        const obj = badObjects.getFirstDead();
        obj.reset(getRandomX(), game.world.height);
        obj.anchor.setTo(0.5, 0.5);
        obj.angle = getRandomStartingAngle();
        obj.height = obj.width = fruitSize;
        obj.body.angularAcceleration = getRandomAngularAcceleration();
        game.physics.arcade.moveToXY(obj, game.world.centerX, game.world.centerY, getRandomSpeed());
    }
    
    /**
     * Gestisce il lancio degli oggetti (chiamato ogni frame)
     * @returns {boolean} True se è stato lanciato qualcosa
     */
    function tryThrowObjects() {
        if (game.time.now > nextFire && goodObjects.countDead() > 0) {
            nextFire = game.time.now + currentFireRate;
            throwGoodObject();
            if (badObjects.countDead() > 0 && Math.random() < currentBombChance) {
                throwBadObject();
            }
            return true;
        }
        return false;
    }
    
    /**
     * Imposta il livello di difficoltà corrente
     * @param {number} level - Indice del livello (0, 1, 2)
     */
    function setDifficulty(level) {
        var levels = config.difficulty;
        var idx = Math.min(level, levels.length - 1);
        var d = levels[idx];
        currentFireRate = d.fireRate;
        currentBombChance = d.bombChance;
        currentSpeedMultiplier = d.speedMultiplier;
    }
    
    /**
     * Uccide un frutto con effetto particelle e animazione esplosione
     * @param {Object} fruit - Sprite del frutto
     * @param {boolean} silent - Se true, non aggiorna il punteggio
     */
    function killFruit(fruit, silent = false) {
        var elementKey = fruit.key || 'bomb';
        playSliceAnimation(fruit.x, fruit.y, elementKey);
        fruit.kill();
    }
    
    /**
     * Riproduce l'animazione di slice usando lo spritesheet dell'elemento
     * @param {number} x - Posizione X
     * @param {number} y - Posizione Y
     * @param {string} elementKey - Chiave dell'elemento (bean, chicken, egg, pig, bomb)
     */
    function playSliceAnimation(x, y, elementKey) {
        var sheetKey = elementKey + 'Slice';

        if (!game.cache.checkImageKey(sheetKey)) {
            sheetKey = 'bombSlice';
        }

        var explosion = game.add.sprite(x, y, sheetKey);
        explosion.anchor.setTo(0.5, 0.5);
        
        var scale = config.sliceAnimation ? config.sliceAnimation.scale : 0.4;
        explosion.scale.setTo(scale, scale);
        
        var frameRate = config.sliceAnimation ? config.sliceAnimation.frameRate : 24;
        explosion.animations.add('explode', null, frameRate, false);
        explosion.animations.play('explode');
        
        explosion.animations.currentAnim.onComplete.add(function() {
            explosion.destroy();
        });
    }
    
    /**
     * Uccide tutti gli oggetti esistenti
     */
    function killAllObjects() {
        goodObjects.forEachExists(fruit => killFruit(fruit, true));
        badObjects.forEachExists(fruit => killFruit(fruit, true));
    }
    
    /**
     * Getters per i gruppi
     */
    function getGoodObjects() {
        return goodObjects;
    }
    
    function getBadObjects() {
        return badObjects;
    }
    
    function getFruitSize() {
        return fruitSize;
    }
    
    // Public API
    return {
        init,
        createAllGroups,
        setFruitSize,
        setDifficulty,
        tryThrowObjects,
        killFruit,
        killAllObjects,
        getGoodObjects,
        getBadObjects,
        getFruitSize
    };
})();

// Export per uso globale
window.GameObjects = GameObjects;
