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
    let player = getCurrentPlayerInfo();
    // ticTacToeAnswer(cell_number);
    console.log(player);
    player.then(result => {
        if (result === "X") {
            cell.style.backgroundImage = "url('./images/Cross.png')";
        } else {
            cell.style.backgroundImage = "url(./images/Circular circle.png)";
        }
    });
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

        return data.current_value;
    } catch (error) {
        console.error("Error fetching current player info:", error);
    }
}

// Call the function to display the current player and value when the page loads
window.onload = getCurrentPlayerInfo;

// Fetch and display the current flashcard question when the page loads
window.onload = fetchCurrentFlashcardQuestion;  // Fetch the first flashcard's question