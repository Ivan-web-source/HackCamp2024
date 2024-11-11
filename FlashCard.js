class FlashCard {
    constructor(question, answer) {
        this.question = question;
        this.answer = answer;
    }

    checkAnswer(submit) {
        submit = submit.toLowerCase();
        if (this.answer === submit) {
            this.markStatusAlreadyReview();
            return true;
        } else {
            return false;
        }
    }

    
}