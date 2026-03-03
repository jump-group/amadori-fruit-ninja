# Amadori Fruit Ninja 🍉

Un gioco web in stile Fruit Ninja realizzato con [Phaser.js 2.6.2](https://phaser.io/) e [Three.js](https://threejs.org/) per la renderizzazione di modelli 3D.

## Screenshot
![Screenshot](screenshot.png)

## Descrizione

Il gioco è un clone di Fruit Ninja personalizzato per Amadori. L'obiettivo è tagliare le spille 3D che volano sullo schermo evitando le bombe. Ogni spilla tagliata aumenta il punteggio, mentre colpire una bomba termina la partita.

### Caratteristiche
- 🎮 Gameplay touch-friendly (funziona su mobile, tablet e desktop)
- 🏆 Leaderboard locale con i migliori 5 punteggi
- 📱 Design responsive che si adatta a qualsiasi dimensione schermo
- 🎨 Modelli 3D renderizzati con Three.js
- ⚡ Fisica realistica con Phaser.js

## Come si gioca

1. Premi **GIOCA** nella schermata iniziale
2. Trascina il dito (o il mouse) sullo schermo per "tagliare"
3. Colpisci le **spille 3D** per guadagnare punti
4. **Evita le bombe!** Colpirne una termina la partita
5. Il tuo punteggio viene salvato nella leaderboard

## Struttura della Codebase

```
amadori-fruit-ninja/
├── index.html              # Entry point HTML
├── css/
│   └── style.css           # Stili CSS
├── js/
│   ├── config.js           # Configurazione e costanti di gioco
│   ├── leaderboard.js      # Gestione punteggi e localStorage
│   ├── three-setup.js      # Setup Three.js e rendering 3D
│   ├── game-objects.js     # Logica frutti, bombe e fisica
│   ├── ui.js               # Interfaccia utente e schermate
│   └── main.js             # Controller principale del gioco
├── assets/
│   └── models/             # Modelli 3D (.glb)
└── images/
    ├── fruits/             # Sprite dei frutti
    ├── bomb.png            # Sprite bomba
    └── explosion.png       # Sprite esplosione
```

### Moduli

| Modulo | Responsabilità |
|--------|----------------|
| `config.js` | Costanti di gioco, configurazione Three.js, calcolo dimensioni responsive |
| `leaderboard.js` | Salvataggio/caricamento punteggi da localStorage |
| `three-setup.js` | Inizializzazione scena 3D, caricamento modelli GLB, rendering |
| `game-objects.js` | Creazione gruppi Phaser, lancio oggetti, gestione collisioni |
| `ui.js` | Schermata iniziale, label di gioco, punteggio |
| `main.js` | Game loop principale, orchestrazione dei moduli |

## Avvio in Locale

### Prerequisiti
- Un browser moderno (Chrome, Firefox, Safari, Edge)
- Un server locale (necessario per caricare i modelli 3D)

### Metodo 1: Python (consigliato)

```bash
# Python 3
cd amadori-fruit-ninja
python -m http.server 8000

# Python 2
cd amadori-fruit-ninja
python -SimpleHTTPServer 8000
```

Apri http://localhost:8000 nel browser.

### Metodo 2: Node.js

```bash
# Installa http-server globalmente
npm install -g http-server

# Avvia il server
cd amadori-fruit-ninja
http-server -p 8000
```

Apri http://localhost:8000 nel browser.

### Metodo 3: VS Code Live Server

1. Installa l'estensione **Live Server** in VS Code
2. Apri il progetto in VS Code
3. Click destro su `index.html` → "Open with Live Server"

### Metodo 4: PHP

```bash
cd amadori-fruit-ninja
php -S localhost:8000
```

## Test

Il gioco non ha un framework di test automatizzato. Per testare manualmente:

1. **Avvia il server locale** (vedi sopra)
2. **Verifica la schermata iniziale**: deve mostrare titolo, leaderboard e pulsante GIOCA
3. **Testa il gameplay**: 
   - Le spille 3D devono apparire e ruotare
   - Il taglio deve funzionare con mouse e touch
   - Il punteggio deve incrementare
4. **Testa le bombe**: colpire una bomba deve terminare la partita
5. **Verifica la leaderboard**: i punteggi devono persistere dopo il refresh
6. **Testa il responsive**: ridimensiona la finestra o usa DevTools per simulare dispositivi

### Debug

Apri la console del browser (F12) per vedere eventuali errori. Il caricamento del modello 3D logga `3D model loaded successfully!` se avvenuto correttamente.

## Tecnologie

- **[Phaser.js 2.6.2](https://phaser.io/)** - Game engine 2D
- **[Three.js r128](https://threejs.org/)** - Rendering 3D
- **GLTFLoader** - Caricamento modelli 3D in formato GLB

## Credits

- <a href="https://iconscout.com/icon/orange-1624198" target="_blank">Orange Icon</a> by <a href="https://iconscout.com/contributors/iconscout" target="_blank">Iconscout Freebies</a>