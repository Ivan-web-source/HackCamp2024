import random

class Tictactoe:
    def __init__(self):
        self.lof = []
        self.vertical1 = [None, None, None]
        self.vertical2 = [None, None, None]
        self.vertical3 = [None, None, None]
        self.horizontal = [self.vertical1, self.vertical2, self.vertical3]
        self.player = {"PLAYER1": "X", "PLAYER2": "O"}
        self.status_player1 = True
        self.horizontal_choice = 0
        self.vertical_choice = 0

    def add_flash_card(self, flash_card):
        self.lof.append(flash_card)

    def remove_flash_card(self, flash_card):
        self.lof.remove(flash_card)

    def change_value(self):
        if len(self.lof) > 0:
            temp = ""  # Placeholder, this could be an answer to the flash card question
            horizontal1 = 0
            vertical = 0

            curr_flash_card = random.choice(self.lof)

            if curr_flash_card.check_answer(temp):
                if self.status_player1:
                    value = self.player["PLAYER1"]
                    self.put_value(value, horizontal1, vertical)
                    self.status_player1 = False
                    self.lof.remove(curr_flash_card)
                    return "Player 1 Move"
                else:
                    value = self.player["PLAYER2"]
                    self.put_value(value, horizontal1, vertical)
                    self.status_player1 = True
                    self.lof.remove(curr_flash_card)
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
        return self.lof

    def return_status_player1(self):
        return self.status_player1
