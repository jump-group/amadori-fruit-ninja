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
    let timerContainer = null;
    let timerValue = null;
    let comboPopup = null;
    let comboTimeout = null;
    let gameOverPopup = null;
    let gameOverScoreEl = null;
    let gameOverNicknameInput = null;
    let gameOverPlayAgainBtn = null;
    let onPlayAgainCallback = null;
    
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
        timerContainer = document.getElementById('timer-container');
        timerValue = document.getElementById('timer-value');
        comboPopup = document.getElementById('combo-popup');
        gameOverPopup = document.getElementById('game-over-popup');
        gameOverScoreEl = document.getElementById('game-over-score-value');
        gameOverNicknameInput = document.getElementById('game-over-nickname');
        gameOverPlayAgainBtn = document.getElementById('game-over-play-again-btn');
        
        if (gameOverPlayAgainBtn) {
            gameOverPlayAgainBtn.addEventListener('click', handlePlayAgainClick);
            gameOverPlayAgainBtn.addEventListener('touchend', handlePlayAgainClick);
        }

        if (gameOverPopup) {
            gameOverPopup.addEventListener('mousedown', function(e) { e.stopPropagation(); });
            gameOverPopup.addEventListener('touchstart', function(e) { e.stopPropagation(); });
        }
        
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
        if (timerContainer) timerContainer.classList.remove('hidden');
    }
    
    /**
     * Nasconde le label di gioco
     */
    function hideGameLabels() {
        if (scoreContainer) scoreContainer.classList.add('hidden');
        if (timerContainer) timerContainer.classList.add('hidden');
        hideCombo();
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
     * Mostra il popup Game Over con il punteggio finale
     * @param {number} finalScore - Punteggio da mostrare
     * @param {Function} onPlayAgain - Callback quando si preme "Gioca ancora"
     */
    function showGameOverPopup(finalScore, onPlayAgain) {
        onPlayAgainCallback = onPlayAgain;
        if (gameOverScoreEl) gameOverScoreEl.textContent = finalScore;
        if (gameOverNicknameInput) gameOverNicknameInput.value = '';
        if (gameOverPopup) {
            gameOverPopup.classList.remove('hidden');
            gameOverPopup.style.animation = 'none';
            gameOverPopup.offsetHeight; // force reflow to restart animation
            gameOverPopup.style.animation = '';
        }
    }
    
    /**
     * Nasconde il popup Game Over
     */
    function hideGameOverPopup() {
        if (gameOverPopup) gameOverPopup.classList.add('hidden');
    }
    
    /**
     * Gestisce il click su "Gioca ancora"
     */
    function handlePlayAgainClick(e) {
        if (e) {
            e.preventDefault();
        }
        hideGameOverPopup();
        if (onPlayAgainCallback) {
            onPlayAgainCallback();
        }
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
    
    /**
     * Aggiorna il timer visualizzato
     * @param {number} seconds - Secondi rimanenti
     */
    function updateTimer(seconds) {
        if (!timerValue) return;
        var m = Math.floor(seconds / 60);
        var s = seconds % 60;
        timerValue.textContent = m + ':' + (s < 10 ? '0' : '') + s;

        if (timerContainer) {
            if (seconds <= 10) {
                timerContainer.classList.add('timer-warning');
            } else {
                timerContainer.classList.remove('timer-warning');
            }
        }
    }
    
    /**
     * Mostra il popup combo
     * @param {number} count - Numero di frutti nella combo
     * @param {number} bonus - Punti bonus ottenuti
     */
    function showCombo(count, bonus) {
        if (!comboPopup) return;
        comboPopup.textContent = 'COMBO x' + count + '  +' + bonus;
        comboPopup.classList.remove('hidden');
        comboPopup.style.animation = 'none';
        comboPopup.offsetHeight;
        comboPopup.style.animation = 'comboAppear 1s ease forwards';
        
        if (comboTimeout) clearTimeout(comboTimeout);
        comboTimeout = setTimeout(function() {
            comboPopup.classList.add('hidden');
        }, 1000);
    }
    
    function hideCombo() {
        if (comboPopup) comboPopup.classList.add('hidden');
        if (comboTimeout) { clearTimeout(comboTimeout); comboTimeout = null; }
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
        updateTimer,
        showCombo,
        hideCombo,
        createStartScreen,
        destroyStartScreen,
        hasStartScreen,
        showGameOverPopup,
        hideGameOverPopup
    };
})();

// Export per uso globale
window.UI = UI;
