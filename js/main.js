/**
 * Main Game Controller
 * Punto di ingresso principale che orchestra tutti i moduli
 */

(function() {
    // Game state
    let game = null;
    let gameStarted = false;
    let score = 0;
    let fontSize = 24;
    let fruitSize = 100;
    
    // Graphics
    let slashes = null;
    let points = [];
    
    // Dimensioni iniziali
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    /**
     * Inizializza il gioco Phaser
     */
    function initGame() {
        game = new Phaser.Game(w, h, Phaser.AUTO, 'game', {
            preload: preload,
            create: create,
            update: update,
            render: render
        }, true); // transparent canvas
    }
    
    /**
     * Preload degli asset
     */
    function preload() {
        const assets = GameConfig.assets;
        
        // Carica elementi di gioco (buoni)
        game.load.image('bean', assets.bean);
        game.load.image('chicken', assets.chicken);
        game.load.image('egg', assets.egg);
        game.load.image('pig', assets.pig);
        
        // Carica bomba e altri asset
        game.load.image('bomb', assets.bomb);
        game.load.image('explosion', assets.explosion);
        game.load.image('start', assets.start);
        game.load.image('game', assets.game);
        game.load.image('over', assets.over);
        
        // Carica spritesheet per animazioni di slice
        const sliceSheet = GameConfig.spritesheets.sliceExplosion;
        game.load.spritesheet('sliceExplosion', sliceSheet.path, sliceSheet.frameWidth, sliceSheet.frameHeight, sliceSheet.frameCount);
    }
    
    /**
     * Creazione del gioco
     */
    function create() {
        // Enable responsive scaling
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        
        // Prevent Phaser from pausing/resuming when tab loses focus
        game.stage.disableVisibilityChange = true;
        
        // Enable touch input
        game.input.maxPointers = 1;
        game.input.addPointer();
        
        // Setup physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = GameConfig.gravity;

        // Initialize modules
        GameObjects.init(game);
        GameObjects.createAllGroups();
        
        UI.init(game);
        
        // Create slash graphics
        slashes = game.add.graphics(0, 0);

        // Calculate responsive sizes
        updateResponsiveSizes();
        
        // Create UI
        UI.createGameLabels();
        UI.updateScore(0);
        
        // Load leaderboard and show start screen
        Leaderboard.load();
        showStartScreen();
        
        // Listen for resize events
        game.scale.onSizeChange.add(onResize, this);
    }
    
    /**
     * Aggiorna le dimensioni responsive
     */
    function updateResponsiveSizes() {
        const sizes = calculateResponsiveSizes(game.world.width, game.world.height);
        fontSize = sizes.fontSize;
        fruitSize = sizes.fruitSize;
        
        UI.setFontSize(fontSize);
        GameObjects.setFruitSize(fruitSize);
    }
    
    /**
     * Gestione resize dello schermo
     */
    function onResize(scaleManager, width, height) {
        updateResponsiveSizes();
        
        // Update gravity
        game.physics.arcade.gravity.y = GameConfig.gravity;
        
        // Recreate UI elements
        UI.recreateLabels();
        
        // Update labels visibility based on game state
        if (gameStarted) {
            UI.showGameLabels();
            UI.updateScore(score);
        }
    }
    
    /**
     * Mostra la schermata di start
     */
    function showStartScreen() {
        UI.createStartScreen(Leaderboard.getScores(), startGame);
    }
    
    /**
     * Avvia il gioco
     */
    function startGame() {
        UI.destroyStartScreen();
        
        // Show start image with animation
        const startImage = game.add.sprite(game.world.centerX, game.world.centerY, 'start');
        startImage.anchor.setTo(0.5, 0.5);
        
        // Scale to fit screen (max 25% of screen width)
        const maxWidth = game.world.width * 0.25;
        const targetScale = maxWidth / startImage.width;
        
        // Start with scale 0 and fade in
        startImage.alpha = 0;
        startImage.scale.setTo(0, 0);
        
        // Animate: scale up and fade in
        game.add.tween(startImage.scale).to({ x: targetScale, y: targetScale }, 300, Phaser.Easing.Back.Out, true);
        game.add.tween(startImage).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
        
        // After 1 second, fade out and start the game
        game.time.events.add(1000, function() {
            game.add.tween(startImage).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true)
                .onComplete.add(function() {
                    startImage.destroy();
                    
                    // Actually start the game
                    gameStarted = true;
                    UI.showGameLabels();
                    score = 0;
                    UI.updateScore(0);
                    GameObjects.tryThrowObjects();
                });
        });
    }
    
    /**
     * Game loop principale
     */
    function update() {
        if (!gameStarted) {
            return;
        }
        
        // Throw objects
        GameObjects.tryThrowObjects();
        
        // Handle input
        handleSlashInput();
    }
    
    /**
     * Gestisce l'input di slash
     */
    function handleSlashInput() {
        const pointer = game.input.activePointer;
        
        if (pointer && pointer.isDown) {
            points.push({
                x: pointer.x,
                y: pointer.y
            });
            points = points.splice(points.length - 10, points.length);
        } else {
            // Clear points when not pressing
            points = [];
            slashes.clear();
            return;
        }

        if (points.length < 1 || points[0].x == 0) {
            return;
        }

        // Draw slash trail
        drawSlashTrail();
        
        // Check intersections
        checkSlashIntersections();
    }
    
    /**
     * Disegna la scia dello slash
     */
    function drawSlashTrail() {
        slashes.clear();
        slashes.beginFill(GameConfig.slashColor);
        slashes.alpha = GameConfig.slashAlpha;
        slashes.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            slashes.lineTo(points[i].x, points[i].y);
        }
        slashes.endFill();
    }
    
    /**
     * Controlla le intersezioni dello slash con gli oggetti
     */
    function checkSlashIntersections() {
        for (let i = 1; i < points.length; i++) {
            const line = new Phaser.Line(points[i].x, points[i].y, points[i - 1].x, points[i - 1].y);
            game.debug.geom(line);

            GameObjects.getGoodObjects().forEachExists(fruit => checkFruitIntersect(fruit, line, true));
            GameObjects.getBadObjects().forEachExists(fruit => checkFruitIntersect(fruit, line, false));
        }
    }
    
    /**
     * Controlla se uno slash interseca un frutto
     * @param {Object} fruit - Lo sprite del frutto
     * @param {Object} line - La linea dello slash
     * @param {boolean} isGood - Se è un oggetto buono
     */
    function checkFruitIntersect(fruit, line, isGood) {
        const l1 = new Phaser.Line(
            fruit.body.right - fruit.width, 
            fruit.body.bottom - fruit.height, 
            fruit.body.right,
            fruit.body.bottom
        );
        const l2 = new Phaser.Line(
            fruit.body.right - fruit.width, 
            fruit.body.bottom, 
            fruit.body.right, 
            fruit.body.bottom - fruit.height
        );
        l2.angle = 90;

        if (Phaser.Line.intersects(line, l1, true) || Phaser.Line.intersects(line, l2, true)) {
            const input = game.input;
            const contactPoint = new Phaser.Point(input.x, input.y);
            const fruitPoint = new Phaser.Point(fruit.x, fruit.y);
            
            // Responsive hit detection based on fruit size
            const hitThreshold = GameObjects.getFruitSize() * 0.6;
            if (Phaser.Point.distance(contactPoint, fruitPoint) > hitThreshold) {
                return;
            }

            if (isGood) {
                onGoodObjectHit(fruit);
            } else {
                onBadObjectHit(fruit);
            }
        }
    }
    
    /**
     * Gestisce il colpo su un oggetto buono
     * @param {Object} fruit - Lo sprite colpito
     */
    function onGoodObjectHit(fruit) {
        GameObjects.killFruit(fruit);
        points = [];
        score += 1;
        UI.updateScore(score);
    }
    
    /**
     * Gestisce il colpo su una bomba
     * @param {Object} bomb - Lo sprite della bomba colpita
     */
    function onBadObjectHit(bomb) {
        // Ferma il gioco immediatamente
        gameStarted = false;
        
        const finalScore = score;
        
        // Save score before reset
        Leaderboard.saveScore(finalScore);
        
        // Kill all objects (con animazione esplosione sulla bomba)
        GameObjects.killAllObjects();
        
        // Reset game state
        score = 0;
        points = [];
        slashes.clear();
        
        // Aspetta che l'animazione dell'esplosione finisca (circa 350ms per 8 frame a 24fps)
        game.time.events.add(400, function() {
            showGameOver(finalScore);
        });
    }
    
    /**
     * Mostra il popup Game Over sopra la schermata di gioco
     * @param {number} finalScore - Punteggio finale da mostrare
     */
    function showGameOver(finalScore) {
        UI.showGameOverPopup(finalScore, function() {
            UI.hideGameOverPopup();
            startGame();
        });
    }
    
    /**
     * Render (debug)
     */
    function render() {}
    
    // Start the game when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        initGame();
    }
})();
