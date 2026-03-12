/**
 * Gestione della leaderboard
 * Handles: salvataggio, caricamento e gestione punteggi
 */

const Leaderboard = (function() {
    const STORAGE_KEY = 'leaderboard_v2';
    
    let entries = [];
    
    function load() {
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                entries = JSON.parse(stored);
            } catch (e) {
                entries = [];
            }
        } else {
            entries = [];
        }
        entries.sort(function(a, b) { return b.score - a.score; });
        return entries;
    }
    
    function saveScore(nickname, score) {
        if (score <= 0) return;
        
        var name = (nickname || '').trim();
        if (!name) name = 'Anonimo';
        
        entries.push({ nickname: name, score: score });
        entries.sort(function(a, b) { return b.score - a.score; });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
    
    /**
     * Ottiene l'highscore corrente
     * @returns {number}
     */
    function getHighscore() {
        if (entries.length === 0) return 0;
        return entries[0].score;
    }
    
    /**
     * Ottiene l'array delle entries correnti
     * @returns {Array} Array di {nickname, score}
     */
    function getEntries() {
        return entries;
    }
    
    /**
     * Resetta la leaderboard
     */
    function reset() {
        entries = [];
        localStorage.removeItem(STORAGE_KEY);
    }
    
    // Public API
    return {
        load,
        saveScore,
        getHighscore,
        getEntries,
        reset
    };
})();

// Export per uso globale
window.Leaderboard = Leaderboard;
