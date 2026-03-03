/**
 * Gestione della leaderboard
 * Handles: salvataggio, caricamento e gestione punteggi
 */

const Leaderboard = (function() {
    const STORAGE_KEY = 'leaderboard';
    const HIGHSCORE_KEY = 'highscore';
    const MAX_ENTRIES = window.GameConfig ? window.GameConfig.maxLeaderboardEntries : 5;
    
    let scores = [];
    
    /**
     * Carica la leaderboard dal localStorage
     * @returns {Array} Array dei punteggi
     */
    function load() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            scores = JSON.parse(stored);
        } else {
            scores = [];
        }
        // Keep only top scores
        scores = scores.sort((a, b) => b - a).slice(0, MAX_ENTRIES);
        return scores;
    }
    
    /**
     * Salva un nuovo punteggio nella leaderboard
     * @param {number} newScore - Punteggio da salvare
     */
    function saveScore(newScore) {
        if (newScore <= 0) return;
        
        scores.push(newScore);
        scores = scores.sort((a, b) => b - a).slice(0, MAX_ENTRIES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
        
        // Aggiorna anche l'highscore
        const currentHighscore = getHighscore();
        if (newScore > currentHighscore) {
            localStorage.setItem(HIGHSCORE_KEY, newScore);
        }
    }
    
    /**
     * Ottiene l'highscore corrente
     * @returns {number} Highscore
     */
    function getHighscore() {
        const stored = localStorage.getItem(HIGHSCORE_KEY);
        return stored ? parseInt(stored, 10) : 0;
    }
    
    /**
     * Ottiene l'array dei punteggi correnti
     * @returns {Array} Array dei punteggi
     */
    function getScores() {
        return scores;
    }
    
    /**
     * Resetta la leaderboard (per debug)
     */
    function reset() {
        scores = [];
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(HIGHSCORE_KEY);
    }
    
    // Public API
    return {
        load,
        saveScore,
        getHighscore,
        getScores,
        reset
    };
})();

// Export per uso globale
window.Leaderboard = Leaderboard;
