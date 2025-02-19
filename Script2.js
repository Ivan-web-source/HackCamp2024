class Script2 {
    // create board, 0 represent board hasn't been filled
    constructor() {
        var board = []; // tic tac toe board
        var flashcards = []; 
        var beginning = 0; // index of current flashcard
        var winner = 0; // 1 for player 1 winner, 2 for player 2
        var turnP1 = true; // set player 1 turn at the beginning of the game
        var correctAns = false; // turns true if player correctly answer the flashcard question
        for (let i = 0; i < 9; i++) {
            board[i] = 0;
        }
    }

     cellOne() { return 1; }
     cellTwo() { return 2; }
     cellThree() { return 3; }
     cellFour() { return 4; }
     cellFive() { return 5; }
     cellSix() { return 6; }
     cellSeven() { return 7; }
     cellEight() { return 8; }
     cellNine() { return 9; }
    
     setCell(cellNum) {
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

    addQuestionList() {
        flashcards.push({question: document.getElementsById("input-question"), answer: document.getElementsById("input-answer")});
        document.getElementById("flashcard-question").innerHTML = flashcards[beginning].question; // display the current flashcard question
    }

    removeQuestion() {
        flashcards.splice(document.getElementById("inputorder") - 1, 1);
    }

    submitAnswer() {
        if (flashcards[beginning].question == document.getElementById("inputanswer")) {
            if (turnP1) {
                turnP1 = false;
            } else {
                turnP1 = true;
            }
            correctAns = true;
            flashcards.splice(beginning, 1); // to make sure player must modify board before entering another answer
            beginning += 1;
        }
    }
    
     async modifyCell(cellNum) {
        if (correctAns) {
            let cell = setCell(cellNum);
        
            if (turnP1) {
                cell.style.backgroundImage = "url('./images/Cross.png')"; // shape of player1
            } else {
                cell.style.backgroundImage = "url('./images/Circular circle.png')"; // shape of player 2
            }

            correctAns = false; // resets so player can only fill the board 1 time
        }
        
    }

    game_finished(board) {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [6, 4, 2]             // Diagonals
        ];
    
        for (const [a, b, c] of winningCombinations) {
            if (board[a] !== 0 && board[a] == 1 && board[a] === board[b] && board[a] === board[c]) {
                winner = 1;
                return true;
            } else if (board[a] !== 0 && board[a] == 2 && board[a] === board[b] && board[a] === board[c]) {
                winner = 2;
                return true;
            }
        }
        for (let i = 0; i < 9; i++) {
            if (board[i] == 0) {
                return false; // even 1 missing piece in the board shows that game can still continue
            }
        }
        return true; // draw
    }
    
}

