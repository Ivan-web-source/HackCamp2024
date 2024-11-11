import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class FlashCard:
    def __init__(self, question, answer):
        self.question = question
        self.answer = answer.lower()
        self.status_answer = False
        self.cell = 0
        self.horizontal1 = 0
        self.vertical = 0
        
        
    def check_answer(self, submit):
        submit = submit.lower()
        if self.answer == submit:
            self.mark_status_already_review()
            return True
        else:
            return False

    def mark_status_already_review(self):
        self.status_answer = True

    def get_answer(self):
        return self.answer

    def get_question(self):
        return self.question

    def get_status_answer(self):
        return self.status_answer
    
class Tictactoe:
    def __init__(self):
        self.flashcards = []
        self.vertical1 = [None, None, None]
        self.vertical2 = [None, None, None]
        self.vertical3 = [None, None, None]
        self.horizontal = [self.vertical1, self.vertical2, self.vertical3]
        self.player = {"PLAYER1": "X", "PLAYER2": "O"}
        self.status_player1 = True

    def add_flash_card(self, flash_card):
        self.flashcards.append(flash_card)

    def remove_flash_card(self, flash_card_number):
        self.flashcards.pop(flash_card_number)
        
        
    def put_cell(self, cell_number):
            if cell_number < 4:
                horizontal1 = 0
                vertical = cell_number - 1
                
                if self.status_player1:
                    value = self.player["PLAYER1"]
                    self.put_value(value, self.horizontal1, self.vertical)
                    self.status_player1 = False
                else:                
                    value = self.player["PLAYER2"]
                    self.put_value(value, self.horizontal1, self.vertical)
                    self.status_player1 = True
            if cell_number < 7 and cell_number > 3:
                horizontal1 = 1
                vertical = cell_number - 4
                
                if self.status_player1:
                    value = self.player["PLAYER1"]
                    self.put_value(value, self.horizontal1, self.vertical)
                    self.status_player1 = False
                else:                
                    value = self.player["PLAYER2"]
                    self.put_value(value, self.horizontal1, self.vertical)
                    self.status_player1 = True
            if cell_number < 10 and cell_number > 6:
                horizontal1 = 2
                vertical = cell_number - 7
                
                if self.status_player1:
                    value = self.player["PLAYER1"]
                    self.put_value(value, self.horizontal1, self.vertical)
                    self.status_player1 = False
                else:                
                    value = self.player["PLAYER2"]
                    self.put_value(value, self.horizontal1, self.vertical)
                    self.status_player1 = True
        
    def change_value(self, answer):
        if len(self.flashcards) > 0:
            temp = answer  # Placeholder, this could be an answer to the flash card question
            
            number = random.randint(0, len(self.flashcards) - 1)
            curr_flash_card = self.flashcards[number]

            if curr_flash_card.check_answer(temp):
                if self.status_player1:
                    self.flashcards.remove_flash_card(number)
                    return "Player 1 Move"
                else:
                    self.flashcards.remove_flash_card(number)
                    return "Player 2 Move"
            else:
                if self.status_player1:
                    self.status_player1 = False
                    return "Wrong answer, Player 2 Turn"
                else:
                    self.status_player1 = True
                    return "Wrong answer, Player 1 Turn"
        return None
        
    def put_value(self, value, horizontal1, vertical):
        self.horizontal_choice = horizontal1
        self.vertical_choice = vertical
        if self.horizontal_choice == 0 and self.vertical1[self.vertical_choice] is None:
            self.vertical1[self.vertical_choice] = value
        elif self.horizontal_choice == 1 and self.vertical2[self.vertical_choice] is None:
            self.vertical2[self.vertical_choice] = value
        elif self.horizontal_choice == 2 and self.vertical3[self.vertical_choice] is None:
            self.vertical3[self.vertical_choice] = value

    def get_flash_cards(self):
        return self.flashcards

    def return_status_player1(self):
        return self.status_player1


# FastAPI app instance
app = FastAPI()

# CORS middleware configuration
origins = [
    "*"  # If you're running the frontend on port 3000 (React or other frontend apps)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Initialize TicTacToe game instance
game = Tictactoe()

# Pydantic model to receive data from JavaScript
class TictactoeInput(BaseModel):
    submitted_answer: str

# API endpoint to make a move
@app.post("/make-move/")
async def make_move(input_data: TictactoeInput):
    result = game.change_value(input_data.submitted_answer)
    return {"message": result}

# API endpoint to get current board state
@app.get("/get-board/")
async def get_board():
    return {"board": game.horizontal}

# API endpoint to get current player status
@app.get("/current-player/")
async def current_player():
    return {"current_player": "PLAYER1" if game.return_status_player1() else "PLAYER2"}

# Pydantic model to receive data from JavaScript
class FlashCardInput(BaseModel):
    question: str
    answer: str

# API endpoint to receive the data from JavaScript and create a FlashCard instance
@app.post("/create-flashcard/")
async def create_flashcard(input_data: FlashCardInput):
    flashcard = FlashCard(input_data.question, input_data.answer)
    game.add_flash_card(flashcard)
    return {
        "message": f"FlashCard created with question: '{flashcard.get_question()}' and answer: '{flashcard.get_answer()}' question number '{len(game.get_flash_cards())}'"
    }

# Pydantic model to receive data from JavaScript
class FlashCardDelete(BaseModel):
    num: int

# API endpoint to receive the data from JavaScript and delete a FlashCard instance
@app.post("/remove-flashcard/")
async def remove(input_data: FlashCardDelete):
    game.remove_flash_card(input_data.num)
    return {
        "message": f"FlashCard number '{input_data.num} in the list has been remove, remaining FlashCard'{len(game.get_flash_cards())}'"
    }
    
# Endpoint to get flashcards
@app.get("/flashcards/")
async def get_flashcards():
    return {"flashcards": game.get_flash_cards()}
# Root route
# @app.get("/")
# def read_root():
#     return {"message": "Welcome to the FlashCard API!"}