// API Configuration
const API_BASE_URL = 'http://3.92.201.193:8000';

// Game state variables
let flashcards = [];
let currentPlayer = 1;
let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let gameActive = true;
let currentQuestionIndex = -1;
let selectedSquare = -1;
let waitingForAnswer = false;
let usedFlashcards = []; // Track used flashcards instead of deleting them

// Page Navigation Functions
function navigateToGame() {
    showTransition(() => {
        window.location.href = 'game.html';
    });
}

function navigateToHome() {
    showTransition(() => {
        window.location.href = 'index.html';
    });
}

function showTransition(callback) {
    const overlay = document.getElementById('transitionOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        
        // Animate the loading squares
        const squares = overlay.querySelectorAll('.loading-square');
        squares.forEach((square, index) => {
            setTimeout(() => {
                square.style.animation = 'loadingPulse 0.5s ease-in-out';
            }, index * 100);
        });
        
        // Execute callback after animation
        setTimeout(() => {
            if (callback) callback();
        }, 1500);
    }
}

// API Functions
async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        return { error: 'API request failed', offline: true };
    }
}

// Game initialization
function initGame() {
    // Only initialize game logic if we're on the game page
    if (document.getElementById('board')) {
        loadFlashcards();
        updateGameStatus();
        attachSquareListeners();
        attachKeyboardListeners();
    }
}

// Load flashcards from API
async function loadFlashcards() {
    try {
        const data = await apiRequest('/flashcards');
        if (data.error) {
            console.error('Failed to load flashcards:', data.error);
            flashcards = [];
        } else {
            flashcards = Array.isArray(data) ? data : [];
        }
        updateFlashcardDisplay();
        updateGameStatus();
    } catch (error) {
        console.error('Failed to load flashcards:', error);
        flashcards = [];
        updateFlashcardDisplay();
        updateGameStatus();
    }
}

// Attach click listeners to squares
function attachSquareListeners() {
    const squares = document.querySelectorAll('.square');
    squares.forEach((square, index) => {
        square.addEventListener('click', () => handleSquareClick(index));
    });
}

// Attach keyboard listeners
function attachKeyboardListeners() {
    const questionInput = document.getElementById('questionInput');
    const answerInput = document.getElementById('answerInput');
    const answerSubmit = document.getElementById('answerSubmit');

    if (questionInput) {
        questionInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                answerInput.focus();
            }
        });
    }

    if (answerInput) {
        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addFlashcard();
            }
        });
    }

    if (answerSubmit) {
        answerSubmit.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitAnswer();
            }
        });
    }
}

// Handle square click
function handleSquareClick(index) {
    if (!gameActive || board[index] !== 0 || waitingForAnswer) {
        return;
    }

    // Get available flashcards (not used ones)
    const availableFlashcards = flashcards.filter(card => !usedFlashcards.includes(card.id));
    
    if (availableFlashcards.length === 0) {
        showNotification('No more flashcards available!', 'warning');
        return;
    }

    selectedSquare = index;
    showRandomQuestion();
}

// Show a random question
function showRandomQuestion() {
    // Get available flashcards (not used ones)
    const availableFlashcards = flashcards.filter(card => !usedFlashcards.includes(card.id));
    
    if (availableFlashcards.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availableFlashcards.length);
    const selectedFlashcard = availableFlashcards[randomIndex];
    
    // Find the original index in the main flashcards array
    currentQuestionIndex = flashcards.findIndex(card => card.id === selectedFlashcard.id);
    
    const question = selectedFlashcard.question;
    
    const questionElement = document.getElementById('currentQuestion');
    const answerInput = document.getElementById('answerSubmit');
    
    if (questionElement && answerInput) {
        questionElement.textContent = question;
        answerInput.value = '';
        answerInput.focus();
        
        waitingForAnswer = true;
        updateGameStatus();
    }
}

// Submit answer - FIXED VERSION
function submitAnswer() {
    if (!waitingForAnswer || currentQuestionIndex === -1 || selectedSquare === -1) {
        console.log('Submit answer called but not in valid state');
        return;
    }

    const answerInput = document.getElementById('answerSubmit');
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = flashcards[currentQuestionIndex].answer.toLowerCase();

    console.log('User answer:', userAnswer, 'Correct answer:', correctAnswer);

    // Store the current state before making changes
    const currentFlashcard = flashcards[currentQuestionIndex];
    const squareToFill = selectedSquare;
    const playerToFill = currentPlayer;

    // Reset waiting state immediately
    waitingForAnswer = false;
    currentQuestionIndex = -1;
    selectedSquare = -1;

    // Clear the question display
    const questionElement = document.getElementById('currentQuestion');
    if (questionElement) {
        questionElement.textContent = 'Click a square to get a question!';
    }
    if (answerInput) {
        answerInput.value = '';
    }

    if (userAnswer === correctAnswer) {
        console.log('Correct answer! Filling square:', squareToFill, 'with player:', playerToFill);
        
        // Mark flashcard as used instead of deleting it
        usedFlashcards.push(currentFlashcard.id);
        
        // Fill the square with animation
        fillSquare(squareToFill, playerToFill);
        
        showNotification('Correct! Square claimed!', 'success');
        
        // Update display
        updateFlashcardDisplay();
        
        // Check for game end conditions
        if (checkWinner()) {
            gameActive = false;
            announceWinner();
            return;
        } else if (checkDraw()) {
            gameActive = false;
            announceDraw();
            return;
        }
        
        // Switch players
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        
    } else {
        showNotification('Incorrect answer! Other player\'s turn.', 'error');
        // Switch players on wrong answer too
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }
    
    // Update game status
    updateGameStatus();
}

// Separate function to fill a square
function fillSquare(index, player) {
    board[index] = player;
    const squares = document.querySelectorAll('.square');
    const square = squares[index];
    
    if (square) {
        square.textContent = player === 1 ? 'X' : 'O';
        square.style.color = player === 1 ? '#ff6b6b' : '#4ecdc4';
        square.classList.add('filled');
        
        // Add animation
        square.style.transform = 'scale(1.2)';
        setTimeout(() => {
            square.style.transform = 'scale(1)';
        }, 200);
    }
}

// Check for winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
            console.log(`Winner found with pattern [${a}, ${b}, ${c}]:`, [board[a], board[b], board[c]]);
            return true;
        }
    }
    return false;
}

// Check for draw
function checkDraw() {
    const isDraw = board.every(cell => cell !== 0);
    console.log('Checking for draw. Board:', board, 'Is draw:', isDraw);
    return isDraw;
}

// Announce winner
function announceWinner() {
    const playerSymbol = currentPlayer === 1 ? 'X' : 'O';
    const winnerText = document.getElementById('winnerText');
    const overlay = document.getElementById('overlay');
    const announcement = document.getElementById('winnerAnnouncement');
    
    if (winnerText && overlay && announcement) {
        winnerText.textContent = `Player ${playerSymbol} Wins! 🎉`;
        overlay.style.display = 'block';
        announcement.style.display = 'block';
        
        // Add celebration animation
        announcement.style.animation = 'celebrateWin 0.5s ease-out';
    }
    
    console.log(`Game over! Player ${playerSymbol} wins!`);
}

// Announce draw
function announceDraw() {
    const winnerText = document.getElementById('winnerText');
    const overlay = document.getElementById('overlay');
    const announcement = document.getElementById('winnerAnnouncement');
    
    if (winnerText && overlay && announcement) {
        winnerText.textContent = "It's a Draw! 🤝";
        overlay.style.display = 'block';
        announcement.style.display = 'block';
    }
    
    console.log('Game over! It\'s a draw!');
}

// Update game status
function updateGameStatus() {
    const statusElement = document.getElementById('gameStatus');
    if (!statusElement) return;
    
    if (!gameActive) {
        statusElement.textContent = 'Game Over';
        statusElement.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
        return;
    }
    
    const availableFlashcards = flashcards.filter(card => !usedFlashcards.includes(card.id));
    
    if (availableFlashcards.length === 0) {
        statusElement.textContent = 'No more flashcards available! Add more or reset the game.';
        statusElement.style.background = 'linear-gradient(45deg, #ffd93d, #ffed4a)';
        return;
    }
    
    if (waitingForAnswer) {
        const playerSymbol = currentPlayer === 1 ? 'X' : 'O';
        statusElement.textContent = `Player ${playerSymbol}: Answer the question to fill the square!`;
        statusElement.style.background = 'linear-gradient(45deg, #4ecdc4, #6ee7dc)';
    } else {
        const playerSymbol = currentPlayer === 1 ? 'X' : 'O';
        statusElement.textContent = `Player ${playerSymbol}'s turn - Click a square!`;
        statusElement.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    }
}

// Add flashcard
async function addFlashcard() {
    const questionInput = document.getElementById('questionInput');
    const answerInput = document.getElementById('answerInput');
    
    if (!questionInput || !answerInput) return;
    
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();

    if (!question || !answer) {
        showNotification('Please enter both question and answer!', 'warning');
        return;
    }

    try {
        const newCard = await apiRequest('/flashcards', 'POST', { question, answer });
        
        if (newCard && !newCard.error) {
            flashcards.push(newCard);
            questionInput.value = '';
            answerInput.value = '';
            
            // Use setTimeout to prevent immediate re-render conflicts
            setTimeout(() => {
                updateFlashcardDisplay();
                updateGameStatus();
            }, 50);
            
            showNotification('Flashcard added successfully!', 'success');
        } else {
            throw new Error('Failed to add flashcard');
        }
    } catch (error) {
        console.error('Failed to add flashcard:', error);
        showNotification('Failed to add flashcard. Please try again.', 'error');
    }
}

// Update flashcard display
function updateFlashcardDisplay() {
    const listElement = document.getElementById('flashcardList');
    const countElement = document.getElementById('flashcardCount');
    
    if (!listElement || !countElement) return;
    
    const availableFlashcards = flashcards.filter(card => !usedFlashcards.includes(card.id));
    countElement.textContent = availableFlashcards.length;
    
    if (availableFlashcards.length === 0) {
        listElement.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No flashcards available.</div>';
        return;
    }

    let html = '';
    availableFlashcards.forEach((card, index) => {
        html += `
            <div class="flashcard-item" style="animation: slideIn 0.3s ease-out ${index * 0.1}s both;">
                <div>
                    <strong>Q:</strong> ${escapeHtml(card.question)}<br>
                </div>
                <button class="remove-btn" onclick="removeFlashcard(${card.id || index})">Remove</button>
            </div>
        `;
    });
    
    listElement.innerHTML = html;
}

// Remove flashcard
async function removeFlashcard(id) {
    try {
        const result = await apiRequest(`/flashcards/${id}`, 'DELETE');
        if (!result.error) {
            flashcards = flashcards.filter(card => (card.id || flashcards.indexOf(card)) !== id);
            // Also remove from used flashcards if it was there
            usedFlashcards = usedFlashcards.filter(usedId => usedId !== id);
            
            // Use setTimeout to prevent immediate re-render conflicts
            setTimeout(() => {
                updateFlashcardDisplay();
                updateGameStatus();
            }, 50);
            
            showNotification('Flashcard removed!', 'info');
        } else {
            throw new Error('Failed to remove flashcard');
        }
    } catch (error) {
        console.error('Failed to remove flashcard:', error);
        showNotification('Failed to remove flashcard. Please try again.', 'error');
    }
}

// Reset game
function resetGame() {
    // Reset all game state variables
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    currentPlayer = 1;
    gameActive = true;
    waitingForAnswer = false;
    currentQuestionIndex = -1;
    selectedSquare = -1;
    usedFlashcards = []; // Reset used flashcards
    
    console.log('Game reset. New board state:', board);
    
    // Clear board display
    const squares = document.querySelectorAll('.square');
    squares.forEach((square, index) => {
        square.textContent = '';
        square.classList.remove('filled');
        square.style.color = '';
        square.style.transform = '';
        console.log(`Cleared square ${index}`);
    });
    
    // Hide winner announcement
    const overlay = document.getElementById('overlay');
    const announcement = document.getElementById('winnerAnnouncement');
    if (overlay && announcement) {
        overlay.style.display = 'none';
        announcement.style.display = 'none';
    }
    
    // Reset question display
    const questionElement = document.getElementById('currentQuestion');
    const answerInput = document.getElementById('answerSubmit');
    if (questionElement) {
        questionElement.textContent = 'Click a square to get a question!';
    }
    if (answerInput) {
        answerInput.value = '';
    }
    
    // Update displays
    updateFlashcardDisplay();
    updateGameStatus();
    showNotification('Game reset! All flashcards are available again.', 'info');
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    });
    
    // Set background color based on type
    const colors = {
        success: 'linear-gradient(45deg, #4ecdc4, #44d9c9)',
        error: 'linear-gradient(45deg, #ff6b6b, #ff5252)',
        warning: 'linear-gradient(45deg, #ffd93d, #ffed4a)',
        info: 'linear-gradient(45deg, #667eea, #764ba2)'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes celebrateWin {
        0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);