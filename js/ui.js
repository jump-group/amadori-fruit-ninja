/**
 * Gestione dell'interfaccia utente
 * Handles: schermata iniziale HTML, label Phaser, punteggio
 */

const UI = (function() {
    // Private variables
    let game = null;
    let tipLabel = null;
    let scoreLabel = null;
    let fontSize = 24;
    let onStartCallback = null;
    
    // DOM elements
    let splashScreen = null;
    let startButton = null;
    
    /**
     * Inizializza il modulo con il riferimento al game Phaser
     * @param {Object} phaserGame - Istanza del gioco Phaser
     */
    function init(phaserGame) {
        game = phaserGame;
        
        // Get DOM references
        splashScreen = document.getElementById('splash-screen');
        startButton = document.getElementById('start-button');
        
        // Setup start button listener
        if (startButton) {
            startButton.addEventListener('click', handleStartClick);
            startButton.addEventListener('touchend', handleStartClick);
        }
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
        
        tipLabel = game.add.text(padding, padding, 'Affetta le monete, evita la dinamite!');
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
     * Mostra la schermata di start (HTML)
     * @param {Array} leaderboard - Array dei punteggi migliori (non usato per ora)
     * @param {Function} onStart - Callback quando si preme "Gioca"
     */
    function createStartScreen(leaderboard, onStart) {
        onStartCallback = onStart;
        
        // Show splash screen
        if (splashScreen) {
            splashScreen.classList.remove('hidden');
        }
        
        // Hide game UI
        hideGameLabels();
    }
    
    /**
     * Gestisce il click sul pulsante start
     */
    function handleStartClick(e) {
        if (e) {
            e.preventDefault();
        }
        if (onStartCallback) {
            onStartCallback();
        }
    }
    
    /**
     * Nasconde la schermata di start
     */
    function destroyStartScreen() {
        if (splashScreen) {
            splashScreen.classList.add('hidden');
        }
    }
    
    /**
     * Verifica se la schermata di start è visibile
     * @returns {boolean}
     */
    function hasStartScreen() {
        return splashScreen && !splashScreen.classList.contains('hidden');
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
