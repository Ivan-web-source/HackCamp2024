// Fetch and store flashcards, then render them
async function fetchFlashcards() {
    try {
        const response = await fetch("http://127.0.0.1:8000/flashcards/");
        if (response.ok) {
            const data = await response.json();
            flashcardList = data.flashcards;  // Store the list of flashcards in the array
            formQuestionList();  // Call formQuestionList after data is fetched
        } else {
            console.error("Failed to fetch flashcards.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Function to render the list of flashcards on the page
function formQuestionList() {
    const container = document.getElementById("add-question-list");

    let content = "";  // Clear the content string

    for (let i = 0; i < flashcardList.length; i++) {
        content += "<div class='question-in-list'>" + flashcardList[i].question + "</div>";
    }

    container.innerHTML = content; // Populate "add-question-list"
}

fetchFlashcards();

// Function to add a new flashcard
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



ticTacToeAnswer();
