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
    switch (cellNum) {
        case 1:
            cell = document.getElementsByClassName("square1");
            break;
        case 2:
            cell = document.getElementsByClassName("square2");
            break;
        case 3:
            cell = document.getElementsByClassName("square3");
            break;
        case 4:
            cell = document.getElementsByClassName("square4");
            break;
        case 5:
            cell = document.getElementsByClassName("square5");
            break;
        case 6:
            cell = document.getElementsByClassName("square6");
            break;
        case 7:
            cell = document.getElementsByClassName("square7");
            break;
        case 8:
            cell = document.getElementsByClassName("square8");
            break;
        case 9:
            cell = document.getElementsByClassName("square9");
            break;
    }
    return cell;
}

function modifyCell(cellNum) {
    cond = ""; // TODO
    let cell = setCell(cellNum);
    ticTacToeAnswer(cell_number);
    if (cond === "Player 1 Move") {
        cell.src = "./images/Cross.png";
    } else if (cond === "Player 2 Move") {
        cell.src = "./images/Circular circle.png";
    }
}

async function createItem() {
    // JavaScript to handle form submission
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
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

// Call the function to attach the event listener when the page loads
createItem();

async function ticTacToeAnswer() {
    document.getElementById('tictactoe-form').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent form from reloading page
    
        // Get values from form fields
        const submitted_answer = document.getElementById('inputanswer').value; // Corrected ID here
    
        // Create an object to send to the backend
        const data1 = {
            submitted_answer: submitted_answer,
        };
    
        // Send data to the FastAPI backend using fetch
        try {
            const response1 = await fetch('http://127.0.0.1:8000/make-move/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data1),
            });
    
            // Get the response from the server
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
    const container2 = document.getElementById("remove-question-list");

    let content = "";  // Clear the content string

    for (let i = 0; i < flashcardList.length; i++) {
        content += "<div class='question-in-list'>" + flashcardList[i].question + "</div>";
    }

    container1.innerHTML = content; // Populate "add-question-list"
    container2.innerHTML = content; // Populate "remove-question-list"
}