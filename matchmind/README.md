# MatchMind 🧠🎯

A modern web-based Tic-Tac-Toe game combined with flashcard learning. Players must answer questions correctly to claim squares on the board!

## 🌟 Features

- **Interactive Tic-Tac-Toe**: Classic gameplay with a learning twist
- **Custom Flashcards**: Create your own questions and answers
- **Real-time Gameplay**: Smooth transitions and animations
- **Responsive Design**: Works on desktop and mobile devices
- **API Backend**: RESTful API for data management
- **Offline Support**: Basic functionality works without internet

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Modern web browser
- Internet connection (for initial setup)

### Installation

1. **Clone or download the project files**
   ```bash
   # Create a new directory for the project
   mkdir matchmind
   cd matchmind
   ```

2. **Set up the file structure**
   ```
   matchmind/
   ├── index.html          # Home page
   ├── game.html           # Game page  
   ├── styles.css          # CSS styles
   ├── frontend.js         # Frontend JavaScript
   ├── main.py            # Python backend
   ├── requirements.txt   # Python dependencies
   └── README.md         # This file
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the backend server**
   ```bash
   python main.py
   ```
   
   The server will start on `http://localhost:8000`

5. **Open the game**
   - Open your web browser
   - Navigate to `http://localhost:8000/static/index.html`
   - Or simply open `index.html` directly in your browser

## 🎮 How to Play

1. **Start on the home page** - Click "Start Playing" to begin
2. **Add flashcards** - Create questions and answers for the game
3. **Take turns** - Players alternate clicking squares
4. **Answer questions** - Correctly answer to claim a square
5. **Win the game** - Get three in a row to win!

## 🛠️ Development

### Project Structure

```
matchmind/
├── Frontend Files:
│   ├── index.html      # Home page with animated landing
│   ├── game.html       # Main game interface
│   ├── styles.css      # All styling and animations
│   └── frontend.js     # Game logic and API communication
│
├── Backend Files:
│   ├── main.py         # FastAPI server
│   └── requirements.txt # Python dependencies
│
└── Data:
    └── matchmind_data.json # Auto-generated data file
```

### API Endpoints

The backend provides a RESTful API:

- `GET /` - API status and information
- `GET /flashcards` - Get all flashcards
- `POST /flashcards` - Create new flashcard
- `PUT /flashcards/{id}` - Update flashcard
- `DELETE /flashcards/{id}` - Delete flashcard
- `GET /stats` - Get usage statistics
- `GET /health` - Health check

