class FlashCard:
    def __init__(self, question, answer):
        self.question = question
        self.answer = answer.lower()
        self.status_answer = False

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
