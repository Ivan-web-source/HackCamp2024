package model;

public class FlashCard {
    private String question;
    private String answer;
    private boolean statusAnswer;


    public FlashCard(String question, String answer) {
        this.question = question;
        this.answer = answer.toLowerCase();
        statusAnswer = false; 
    }

    public boolean checkAnswer(String submit) {
        submit = submit.toLowerCase();
        if (this.answer.equals(submit)) {
            markStatusAlreadyReview();
            return true;
        } else {
            return false;
        }
    }

    public void markStatusAlreadyReview() {
        this.statusAnswer = true;
    }

    public String getAnswer() {
        return answer;
    }

    public String getQuestion() {
        return question;
    }

    public boolean getStatusAnswer() {
        return statusAnswer;
    }




}