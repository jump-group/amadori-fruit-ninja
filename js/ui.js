/**
 * Gestione dell'interfaccia utente
 * Handles: schermata iniziale HTML, label Phaser, punteggio
 */

const UI = (function() {
    // Private variables
    let game = null;
    let fontSize = 24;
    let onStartCallback = null;
    
    // DOM elements
    let splashScreen = null;
    let startButton = null;
    let scoreContainer = null;
    let scoreValue = null;
    
    /**
     * Inizializza il modulo con il riferimento al game Phaser
     * @param {Object} phaserGame - Istanza del gioco Phaser
     */
    function init(phaserGame) {
        game = phaserGame;
        
        // Get DOM references
        splashScreen = document.getElementById('splash-screen');
        startButton = document.getElementById('start-button');
        scoreContainer = document.getElementById('score-container');
        scoreValue = document.getElementById('score-value');
        
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
     * Crea le label di gioco (non più usata)
     */
    function createGameLabels() {
        // Score ora gestito via HTML
    }
    
    /**
     * Distrugge e ricrea le label (per resize)
     */
    function recreateLabels() {
        // Score ora gestito via HTML
    }
    
    /**
     * Mostra le label di gioco
     */
    function showGameLabels() {
        if (scoreContainer) scoreContainer.classList.remove('hidden');
    }
    
    /**
     * Nasconde le label di gioco
     */
    function hideGameLabels() {
        if (scoreContainer) scoreContainer.classList.add('hidden');
    }
    
    /**
     * Aggiorna il punteggio visualizzato
     * @param {number} score - Punteggio da visualizzare
     */
    function updateScore(score) {
        if (scoreValue) {
            scoreValue.textContent = score;
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
