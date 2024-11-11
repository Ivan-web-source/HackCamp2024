function cellOne() { return 1; }
function cellTwo() { return 2; }
function cellThree() { return 3; }
function cellFour() { return 4; }
function cellFive() { return 5; }
function cellSix() { return 6; }
function cellSeven() { return 7; }
function cellEight() { return 8; }
function cellNine() { return 9; }

function setCell() {
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

function modifyCell() {
    cond = ""; // TODO
    let cell = setCell();
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
        const question = document.getElementById('question').value;
        const answer = document.getElementById('answer').value;

        // Create an object to send to the backend
        const data = {
            question: question,
            answer: answer
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