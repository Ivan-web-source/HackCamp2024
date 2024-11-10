package model;

import java.util.ArrayList;
import java.util.Map;
import java.util.Random;
import java.util.HashMap;

//Represent Tictactoe
public class Tictactoe {
    private ArrayList<FlashCard> lof;
    private ArrayList<ArrayList<String>> horizontal;
    private ArrayList<String> vertical1;
    private ArrayList<String> vertical2;
    private ArrayList<String> vertical3;
    private Map<String, String> player;
    private boolean statusPlayer1;
    private int horizontalChoice;
    private int verticalChoice;



    public Tictactoe () {
        lof = new ArrayList<>();
        vertical1 = new ArrayList<>();
        vertical2 = new ArrayList<>();
        vertical3 = new ArrayList<>();
        horizontal = new ArrayList<>();
        player = new HashMap<String, String>();
        statusPlayer1 = true;
        init();
    }

    public void init() {
        player.put("PLAYER1", "X");
        player.put("PLAYER2", "O");
        horizontal.add(vertical1);
        horizontal.add(vertical2);
        horizontal.add(vertical3);
        vertical1.add(null);
        vertical1.add(null);
        vertical1.add(null);
        vertical2.add(null);
        vertical2.add(null);
        vertical2.add(null);
        vertical3.add(null);
        vertical3.add(null);
        vertical3.add(null);

    }

    public void addFlashCard(FlashCard f1) {
        lof.add(f1);
    }

    public void removeFlashCard(FlashCard f1) {
        lof.remove(f1);
    }

    public void changeValue() {
        if (lof.size() > 0) {
            //TODO LIHAT ANJENG
            String temp = "";
            int horizontal1 = 0;
            int vertical = 0;

            Random rand = new Random();
            int randomElement = rand.nextInt(lof.size());
            FlashCard currFlashCard = lof.get(randomElement);
            if (currFlashCard.checkAnswer(temp)) {

            }
            if (statusPlayer1 == true) {
                String value = player.get("PLAYER1");
                putValue(value, horizontal1, vertical);
                statusPlayer1 = false;
            } else {
                String value = player.get("PLAYER2");
                putValue(value, horizontal1, vertical); 
                statusPlayer1 = true;
            }
        }

    }

    private void putValue(String value, int horizontal1, int vertical) {
        if (horizontalChoice == 0) {
            if (vertical1.get(verticalChoice) == null) {
                vertical1.remove(verticalChoice);
                vertical1.add(verticalChoice, value);
            }
        } else if (horizontalChoice == 1) {
            if (vertical2.get(verticalChoice) == null) {
                vertical2.remove(verticalChoice);
                vertical2.add(verticalChoice, value);
            }
        } else {
            if (vertical3.get(verticalChoice) == null) {
                vertical3.remove(verticalChoice);
                vertical3.add(verticalChoice, value);
            }
        }
    }

    public ArrayList<FlashCard> getFlashCards() {
        return lof;
    }

}
