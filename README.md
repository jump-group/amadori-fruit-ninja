# Protein Hunter

Un gioco web in stile Fruit Ninja realizzato con [Phaser.js 2.6.2](https://phaser.io/) per Amadori.

## Descrizione

L'obiettivo è tagliare le monete proteiche che volano sullo schermo, creando combo ed evitando la dinamite. La partita dura 60 secondi e la difficoltà aumenta progressivamente.

### Caratteristiche
- Gameplay touch-friendly (mobile, tablet e desktop)
- Sistema combo: tagliare 3+ elementi in uno swipe dà punti bonus
- Difficoltà progressiva ogni 20 secondi (velocità, frequenza bombe)
- Dinamite: -10 punti e reset combo
- Timer da 60 secondi con game over popup
- Animazioni di slice dedicate per ogni elemento
- Leaderboard locale (top 5)
- Design responsive

## Come si gioca

1. Premi **Gioca ora** nella schermata iniziale
2. Trascina il dito (o il mouse) sullo schermo per tagliare
3. Colpisci le **monete proteiche** per guadagnare punti (+1 ciascuna)
4. Taglia **3+ elementi in uno swipe** per attivare una combo (+N punti bonus)
5. **Evita la dinamite!** Ogni bomba colpita sottrae 10 punti e resetta la combo
6. La partita termina allo scadere del timer di 60 secondi

## Struttura del Progetto

```
amadori-fruit-ninja/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js           # Configurazione, costanti, livelli di difficoltà
│   ├── leaderboard.js      # Gestione punteggi (localStorage)
│   ├── game-objects.js     # Frutti, bombe, fisica, animazioni slice
│   ├── ui.js               # UI: splash, score, timer, combo, game over
│   └── main.js             # Game loop, combo, timer, difficoltà
└── images/
    ├── elements/           # Sprite degli elementi di gioco
    ├── spritesheets/       # Spritesheets animazioni di slice
    ├── background.png
    └── decorative-stripes.png
```

### Moduli

| Modulo | Responsabilità |
|--------|----------------|
| `config.js` | Costanti, livelli di difficoltà, calcolo dimensioni responsive |
| `leaderboard.js` | Salvataggio/caricamento punteggi da localStorage |
| `game-objects.js` | Gruppi Phaser, lancio oggetti, difficoltà dinamica, animazioni |
| `ui.js` | Splash screen, score, timer, combo popup, game over popup |
| `main.js` | Game loop, tracking combo/swipe, timer, orchestrazione moduli |

## Avvio in Locale

### Prerequisiti
- Un browser moderno (Chrome, Firefox, Safari, Edge)
- Un server locale per servire i file

### Python (consigliato)

```bash
cd amadori-fruit-ninja
python3 -m http.server 8000
```

Apri http://localhost:8000 nel browser.

### Node.js

```bash
npx serve -l 8000
```

### VS Code / Cursor Live Server

1. Installa l'estensione **Live Server**
2. Click destro su `index.html` → "Open with Live Server"

## Tecnologie

- **[Phaser.js 2.6.2](https://phaser.io/)** - Game engine 2D