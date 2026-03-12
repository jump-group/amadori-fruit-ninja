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
    let gameOverSaveBtn = null;
    let gameOverStepNickname = null;
    let gameOverStepActions = null;
    let gameOverSavedMsg = null;
    let gameOverPlayAgainBtn = null;
    let gameOverLeaderboardBtn = null;
    let leaderboardPopup = null;
    let leaderboardList = null;
    let leaderboardEmpty = null;
    let leaderboardCloseBtn = null;
    let onSaveCallback = null;
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
        gameOverSaveBtn = document.getElementById('game-over-save-btn');
        gameOverStepNickname = document.getElementById('game-over-step-nickname');
        gameOverStepActions = document.getElementById('game-over-step-actions');
        gameOverSavedMsg = document.getElementById('game-over-saved-msg');
        gameOverPlayAgainBtn = document.getElementById('game-over-play-again-btn');
        gameOverLeaderboardBtn = document.getElementById('game-over-leaderboard-btn');
        leaderboardPopup = document.getElementById('leaderboard-popup');
        leaderboardList = document.getElementById('leaderboard-list');
        leaderboardEmpty = document.getElementById('leaderboard-empty');
        leaderboardCloseBtn = document.getElementById('leaderboard-close-btn');
        
        if (gameOverSaveBtn) {
            gameOverSaveBtn.addEventListener('click', handleSaveClick);
            gameOverSaveBtn.addEventListener('touchend', handleSaveClick);
        }
        
        if (gameOverPlayAgainBtn) {
            gameOverPlayAgainBtn.addEventListener('click', handlePlayAgainClick);
            gameOverPlayAgainBtn.addEventListener('touchend', handlePlayAgainClick);
        }
        
        if (gameOverLeaderboardBtn) {
            gameOverLeaderboardBtn.addEventListener('click', handleLeaderboardClick);
            gameOverLeaderboardBtn.addEventListener('touchend', handleLeaderboardClick);
        }
        
        if (leaderboardCloseBtn) {
            leaderboardCloseBtn.addEventListener('click', hideLeaderboard);
            leaderboardCloseBtn.addEventListener('touchend', hideLeaderboard);
        }

        if (gameOverPopup) {
            gameOverPopup.addEventListener('mousedown', function(e) { e.stopPropagation(); });
            gameOverPopup.addEventListener('touchstart', function(e) { e.stopPropagation(); });
        }
        
        if (leaderboardPopup) {
            leaderboardPopup.addEventListener('mousedown', function(e) { e.stopPropagation(); });
            leaderboardPopup.addEventListener('touchstart', function(e) { e.stopPropagation(); });
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
     * Mostra il popup Game Over con il punteggio finale (step 1: nickname)
     * @param {number} finalScore - Punteggio da mostrare
     * @param {Function} onSave - Callback(nickname) quando si salva il nickname
     * @param {Function} onPlayAgain - Callback() quando si preme "Gioca ancora"
     */
    function showGameOverPopup(finalScore, onSave, onPlayAgain) {
        onSaveCallback = onSave;
        onPlayAgainCallback = onPlayAgain;
        
        if (gameOverScoreEl) gameOverScoreEl.textContent = finalScore;
        if (gameOverNicknameInput) gameOverNicknameInput.value = '';
        
        if (gameOverStepNickname) gameOverStepNickname.classList.remove('hidden');
        if (gameOverStepActions) gameOverStepActions.classList.add('hidden');
        
        if (gameOverPopup) {
            gameOverPopup.classList.remove('hidden');
            gameOverPopup.style.animation = 'none';
            gameOverPopup.offsetHeight;
            gameOverPopup.style.animation = '';
        }
    }
    
    function hideGameOverPopup() {
        if (gameOverPopup) gameOverPopup.classList.add('hidden');
    }
    
    /**
     * Gestisce il click su "Salva punteggio"
     */
    function handleSaveClick(e) {
        if (e) e.preventDefault();
        
        var nickname = '';
        if (gameOverNicknameInput) nickname = gameOverNicknameInput.value.trim();
        if (!nickname) nickname = 'Anonimo';
        
        if (onSaveCallback) onSaveCallback(nickname);
        
        if (gameOverStepNickname) gameOverStepNickname.classList.add('hidden');
        if (gameOverStepActions) gameOverStepActions.classList.remove('hidden');
        if (gameOverSavedMsg) gameOverSavedMsg.textContent = 'Punteggio salvato come "' + nickname + '"';
    }
    
    function handlePlayAgainClick(e) {
        if (e) e.preventDefault();
        hideGameOverPopup();
        if (onPlayAgainCallback) onPlayAgainCallback();
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
    
    function handleLeaderboardClick(e) {
        if (e) e.preventDefault();
        showLeaderboard();
    }
    
    function showLeaderboard() {
        var entries = Leaderboard.getEntries();
        
        if (leaderboardList) {
            leaderboardList.innerHTML = '';
            entries.forEach(function(entry) {
                var li = document.createElement('li');
                li.innerHTML = '<span class="lb-nickname">' + escapeHtml(entry.nickname) + '</span><span class="lb-score">' + entry.score + '</span>';
                leaderboardList.appendChild(li);
            });
        }
        
        if (leaderboardEmpty) {
            if (entries.length === 0) {
                leaderboardEmpty.classList.remove('hidden');
            } else {
                leaderboardEmpty.classList.add('hidden');
            }
        }
        
        if (leaderboardPopup) {
            leaderboardPopup.classList.remove('hidden');
            leaderboardPopup.style.animation = 'none';
            leaderboardPopup.offsetHeight;
            leaderboardPopup.style.animation = '';
        }
    }
    
    function hideLeaderboard(e) {
        if (e) e.preventDefault();
        if (leaderboardPopup) leaderboardPopup.classList.add('hidden');
    }
    
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
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
