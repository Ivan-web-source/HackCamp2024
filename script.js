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
            cell = document.getElementsByClassName("cell-one");
            break;
        case 2:
            cell = document.getElementsByClassName("cell-two");
            break;
        case 3:
            cell = document.getElementsByClassName("cell-three");
            break;
        case 4:
            cell = document.getElementsByClassName("cell-four");
            break;
        case 5:
            cell = document.getElementsByClassName("cell-five");
            break;
        case 6:
            cell = document.getElementsByClassName("cell-six");
            break;
        case 7:
            cell = document.getElementsByClassName("cell-seven");
            break;
        case 8:
            cell = document.getElementsByClassName("cell-eight");
            break;
        case 9:
            cell = document.getElementsByClassName("cell-nine");
            break;
    }
    return cell;
}

function modifyCell() {
    cond = ""; // TODO
    let cell = setCell();
    if (cond === "Player 1 Move") {
        cell.src = ""; // TODO
    } else if (cond === "Player 2 Move") {
        cell.src = ""; // TODO
    }
}


// function sendData() {
//     const inputData = {
//         text: document.getElementById('inputText').value
//     };

//     fetch('http://127.0.0.1:8000/items/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(inputData)
//     })
//     .then(response => response.text())
//     .then(data => console.log("Response from Python:", data))
//     .catch(error => console.error("Error:", error));
// }

async function createItem() {
    // JavaScript to handle form submission
    document.getElementById('flashcard-form').addEventListener('submit', async function(event) {
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