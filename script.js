function cellOne() { return 1; }
function cellTwo() { return 2; }
function cellThree() { return 3; }
function cellFour() { return 4; }
function cellFive() { return 5; }
function cellSix() { return 6; }
function cellSeven() { return 7; }
function cellEight() { return 8; }
function cellNine() { return 9; }

function setCell(cellNum) {
    let cell;
    switch (cellNum) {
        case 1:
            cell = document.getElementsByClassName("square1")[0];
            break;
        case 2:
            cell = document.getElementsByClassName("square2")[0];
            break;
        case 3:
            cell = document.getElementsByClassName("square3")[0];
            break;
        case 4:
            cell = document.getElementsByClassName("square4")[0];
            break;
        case 5:
            cell = document.getElementsByClassName("square5")[0];
            break;
        case 6:
            cell = document.getElementsByClassName("square6")[0];
            break;
        case 7:
            cell = document.getElementsByClassName("square7")[0];
            break;
        case 8:
            cell = document.getElementsByClassName("square8")[0];
            break;
        case 9:
            cell = document.getElementsByClassName("square9")[0];
            break;
    }
    return cell;
}

function modifyCell(cellNum) {
    let cell = setCell(cellNum);
    console.log(result1);
    // ticTacToeAnswer(cell_number);
    if (result1 == "Player 1 Move") {
        cell.style.backgroundImage = "url('./images/Cross.png')";
    } else if (result1 == "Player 2 Move") {
        cell.src = "./images/Circular circle.png";
    }
}

async function createItem() {
    document.getElementById('flashcard-Form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent form from reloading page

        // Get values from form fields
        const inputquestion = document.getElementById('inputquestion').value;
        const inputanswer = document.getElementById('inputanswer').value;

        // Create an object to send to the backend
        const data = {
            question: inputquestion,
            answer: inputanswer
        };

        // Send data to the FastAPI backend using fetch
        try {
            const response = await fetch('http://127.0.0.1:8000/create-flashcard/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // Get the response from the server
            const result = await response.json();
            alert(result.message); // Show the server's response in an alert

            // Refresh the list of flashcards after adding a new one
            fetchFlashcards();
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

createItem();

// Function to handle tic-tac-toe move submission (if needed for other purposes)
async function ticTacToeAnswer() {
    document.getElementById('tictactoe-form').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent form from reloading page
    
        const submitted_answer = document.getElementById('inputanswer').value;
        const data1 = { submitted_answer: submitted_answer };

        try {
            const response1 = await fetch('http://127.0.0.1:8000/make-move/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data1),
            });

            const result1 = await response1.json();
            alert(result1.message); // Show the server's response in an alert
        } catch (error) {
            console.error('Error:', error);
        }
    });
}
ticTacToeAnswer()


let flashcardList = [];

// Function to fetch flashcards from the FastAPI backend
async function fetchFlashcards() {
    try {
        const response = await fetch("http://127.0.0.1:8000/flashcards/");
        if (response.ok) {
            const data = await response.json();
            flashcardList = data.flashcards;  // Store the list of flashcards in the array
            console.log("Flashcard List:", flashcardList);  // Log the array to the console
            formQuestionList();  // Call formQuestionList after data is fetched
        } else {
            console.error("Failed to fetch flashcards.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Fetch and store flashcards, then render them
fetchFlashcards();

function formQuestionList() {
    const container1 = document.getElementById("add-question-list");
    const container2 = document.getElementById("remove-questions-list");

    let content = "";  // Clear the content string

    for (let i = 0; i < flashcardList.length; i++) {
        content += "<div class='question-in-list'>" + flashcardList[i].question + "</div>\n";
    }

    container1.innerHTML = content; // Populate "add-question-list"
    container2.innerHTML = content;
}

async function fetchCurrentFlashcardQuestion() {
    try {
        // Send a GET request to the FastAPI backend
        const response = await fetch('http://127.0.0.1:8000/get-current-flashcard-question');
        const data = await response.json();

        // Check if a valid question is returned
        if (data.question) {
            // Display the question on the page
            document.getElementById('flashcard-question').innerHTML = `${data.question}`;
        } else {
            console.error("Error fetching flashcard:", data.error);
        }
    } catch (error) {
        console.error('Error fetching flashcard:', error);
    }
}

async function getCurrentPlayerInfo() {
    try {
        const response = await fetch('http://127.0.0.1:8000/current-player-info/');
        const data = await response.json();
        console.log('Current Player:', data.current_player); // 'PLAYER1' or 'PLAYER2'
        console.log('Current Value:', data.current_value);   // 'X' or 'O'

        // Example: Update HTML to show current player and value
        document.getElementById("current-player").innerText = `Current Player: ${data.current_player}`;
        document.getElementById("current-value").innerText = `Current Value: ${data.current_value}`;
    } catch (error) {
        console.error("Error fetching current player info:", error);
    }
}


// Function to check the game status after each move
async function checkGameStatus() {
    try {
        // Fetch game status from the FastAPI backend
        const response = await fetch("http://127.0.0.1:8000/game-status/");
        
        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        // Parse the response as JSON
        const data = await response.json();
        
        // Log the data to the console to verify
        console.log(data);
        
        // Get the game status from the response
        const gameStatus = data.game_status;
        
        // Update the game status on the page
        updateGameStatus(gameStatus);
    } catch (error) {
        console.error('Error checking game status:', error);
    }
}

// Function to update the game status in the UI
function updateGameStatus(status) {
    const statusElement = document.getElementById("game-status");

    // Log the status to verify it's being passed correctly
    console.log('Updating game status:', status);
    
    if (!status) {
        statusElement.textContent = "Error: Could not fetch game status.";
        return;
    }

    if (status === "ongoing") {
        statusElement.textContent = "Game is ongoing. Make your move!";
        statusElement.style.color = "green";
    } else if (status === "win") {
        statusElement.textContent = "Game Over! Player has won!";
        statusElement.style.color = "red";
    } else if (status === "draw") {
        statusElement.textContent = "Game Over! It's a draw!";
        statusElement.style.color = "blue";
    } else {
        statusElement.textContent = "Error: Unknown status.";
    }
}


// Call this function when a player makes a move
async function makeMove(cellNumber, answer) {
    // Send the move data (e.g., cell number and answer) to the backend
    await fetch("http://127.0.0.1:8000/current-player-info", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ submitted_answer: answer }),
    });

    // After making a move, check if the game has finished
    await checkGameStatus();
}

// Example of handling a move (you can wire this to your board's click events)
document.getElementById("board").addEventListener("click", (event) => {
    // Get cell number and answer from the event (just an example)
    const cellNumber = event.target.dataset.cell;  // Assume data-cell attribute on each cell
    const answer = "yourAnswer";  // Answer should come from user input

    makeMove(cellNumber, answer);
});

// Call the function to display the current player and value when the page loads
window.onload = getCurrentPlayerInfo;

// Fetch and display the current flashcard question when the page loads
window.onload = fetchCurrentFlashcardQuestion;  // Fetch the first flashcard's question