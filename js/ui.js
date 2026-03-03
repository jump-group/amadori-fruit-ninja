/**
 * Gestione dell'interfaccia utente
 * Handles: schermata iniziale, label, punteggio
 */

const UI = (function() {
    // Private variables
    let game = null;
    let tipLabel = null;
    let scoreLabel = null;
    let startScreenGroup = null;
    let fontSize = 24;
    let onStartCallback = null;
    
    /**
     * Inizializza il modulo con il riferimento al game Phaser
     * @param {Object} phaserGame - Istanza del gioco Phaser
     */
    function init(phaserGame) {
        game = phaserGame;
    }
    
    /**
     * Imposta la dimensione del font
     * @param {number} size - Dimensione in pixel
     */
    function setFontSize(size) {
        fontSize = size;
    }
    
    /**
     * Crea le label di gioco (tip e score)
     */
    function createGameLabels() {
        const padding = Math.max(Math.round(game.world.width * 0.02), 10);
        const lineSpacing = Math.round(fontSize * 1.5);
        
        tipLabel = game.add.text(padding, padding, 'Taglia le spille, evita le bombe!');
        tipLabel.fill = 'white';
        tipLabel.fontSize = fontSize;

        scoreLabel = game.add.text(padding, padding + lineSpacing);
        scoreLabel.fontSize = fontSize;
    }
    
    /**
     * Distrugge e ricrea le label (per resize)
     */
    function recreateLabels() {
        if (tipLabel) tipLabel.destroy();
        if (scoreLabel) scoreLabel.destroy();
        createGameLabels();
    }
    
    /**
     * Mostra le label di gioco
     */
    function showGameLabels() {
        if (tipLabel) tipLabel.visible = true;
        if (scoreLabel) scoreLabel.visible = true;
    }
    
    /**
     * Nasconde le label di gioco
     */
    function hideGameLabels() {
        if (tipLabel) tipLabel.visible = false;
        if (scoreLabel) scoreLabel.visible = false;
    }
    
    /**
     * Aggiorna il punteggio visualizzato
     * @param {number} score - Punteggio da visualizzare
     */
    function updateScore(score) {
        if (scoreLabel) {
            scoreLabel.text = `Score: ${score}`;
            scoreLabel.fill = '#9adcfa';
        }
    }
    
    /**
     * Crea la schermata di start
     * @param {Array} leaderboard - Array dei punteggi migliori
     * @param {Function} onStart - Callback quando si preme "Gioca"
     */
    function createStartScreen(leaderboard, onStart) {
        onStartCallback = onStart;
        startScreenGroup = game.add.group();
        
        // Calculate responsive sizes
        const titleFontSize = Math.round(fontSize * 1.8);
        const leaderboardFontSize = fontSize;
        const entryFontSize = Math.round(fontSize * 0.85);
        const instructionFontSize = Math.round(fontSize * 0.7);
        
        // Responsive spacing
        const titleY = game.world.height * 0.1;
        const leaderboardTitleY = game.world.height * 0.22;
        const leaderboardStartY = game.world.height * 0.30;
        const leaderboardSpacing = Math.max(fontSize * 1.3, 30);
        const buttonY = game.world.height * 0.72;
        const instructionY = game.world.height * 0.88;

        // Title
        const titleStyle = { font: 'bold ' + titleFontSize + 'px Arial', fill: '#ff6347', align: 'center' };
        const title = game.add.text(game.world.centerX, titleY, '🍉 FRUIT NINJA 🍉', titleStyle);
        title.anchor.setTo(0.5, 0.5);
        startScreenGroup.add(title);

        // Leaderboard title
        const leaderboardTitleStyle = { font: 'bold ' + leaderboardFontSize + 'px Arial', fill: '#9adcfa', align: 'center' };
        const leaderboardTitle = game.add.text(game.world.centerX, leaderboardTitleY, '🏆 LEADERBOARD 🏆', leaderboardTitleStyle);
        leaderboardTitle.anchor.setTo(0.5, 0.5);
        startScreenGroup.add(leaderboardTitle);

        // Leaderboard entries
        const entryStyle = { font: entryFontSize + 'px Arial', fill: '#ffffff', align: 'center' };

        if (leaderboard.length === 0) {
            const noScores = game.add.text(game.world.centerX, leaderboardStartY, 'Nessun punteggio ancora!', entryStyle);
            noScores.anchor.setTo(0.5, 0.5);
            startScreenGroup.add(noScores);
        } else {
            for (let i = 0; i < leaderboard.length; i++) {
                const medal = i === 0 ? '🥇' : (i === 1 ? '🥈' : (i === 2 ? '🥉' : '  '));
                const entryText = medal + ' ' + (i + 1) + '. ' + leaderboard[i] + ' punti';
                const entry = game.add.text(game.world.centerX, leaderboardStartY + (i * leaderboardSpacing), entryText, entryStyle);
                entry.anchor.setTo(0.5, 0.5);
                startScreenGroup.add(entry);
            }
        }

        // Start button
        createStartButton(buttonY);

        // Instructions
        const instructionStyle = { font: instructionFontSize + 'px Arial', fill: '#cccccc', align: 'center' };
        const instructions = game.add.text(game.world.centerX, instructionY, 'Taglia le spille, evita le bombe!', instructionStyle);
        instructions.anchor.setTo(0.5, 0.5);
        startScreenGroup.add(instructions);

        // Hide game UI initially
        hideGameLabels();
    }
    
    /**
     * Crea il pulsante di start
     * @param {number} buttonY - Posizione Y del pulsante
     */
    function createStartButton(buttonY) {
        const minButtonWidth = 150;
        const maxButtonWidth = 400;
        const buttonWidth = Math.min(Math.max(game.world.width * 0.35, minButtonWidth), maxButtonWidth);
        const buttonHeight = Math.max(fontSize * 2.2, 50);
        const buttonRadius = Math.round(buttonHeight * 0.2);

        const buttonGraphics = game.add.graphics(0, 0);
        buttonGraphics.beginFill(0x4CAF50);
        buttonGraphics.drawRoundedRect(
            game.world.centerX - buttonWidth / 2,
            buttonY - buttonHeight / 2,
            buttonWidth,
            buttonHeight,
            buttonRadius
        );
        buttonGraphics.endFill();
        startScreenGroup.add(buttonGraphics);

        const buttonTextStyle = { font: 'bold ' + fontSize + 'px Arial', fill: '#ffffff', align: 'center' };
        const buttonText = game.add.text(game.world.centerX, buttonY, '▶ GIOCA', buttonTextStyle);
        buttonText.anchor.setTo(0.5, 0.5);
        startScreenGroup.add(buttonText);

        // Make button interactive with larger touch area for mobile
        const touchPadding = 20;
        const hitArea = game.add.sprite(
            game.world.centerX - buttonWidth / 2 - touchPadding,
            buttonY - buttonHeight / 2 - touchPadding
        );
        hitArea.width = buttonWidth + touchPadding * 2;
        hitArea.height = buttonHeight + touchPadding * 2;
        hitArea.inputEnabled = true;
        hitArea.input.useHandCursor = true;
        hitArea.events.onInputDown.add(handleStartClick, this);
        startScreenGroup.add(hitArea);
    }
    
    /**
     * Gestisce il click sul pulsante start
     */
    function handleStartClick() {
        if (onStartCallback) {
            onStartCallback();
        }
    }
    
    /**
     * Distrugge la schermata di start
     */
    function destroyStartScreen() {
        if (startScreenGroup) {
            startScreenGroup.destroy();
            startScreenGroup = null;
        }
    }
    
    /**
     * Verifica se la schermata di start esiste
     * @returns {boolean}
     */
    function hasStartScreen() {
        return startScreenGroup !== null;
    }
    
    // Public API
    return {
        init,
        setFontSize,
        createGameLabels,
        recreateLabels,
        showGameLabels,
        hideGameLabels,
        updateScore,
        createStartScreen,
        destroyStartScreen,
        hasStartScreen
    };
})();

// Export per uso globale
window.UI = UI;
