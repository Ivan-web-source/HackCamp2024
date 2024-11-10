package test.model;
import model.*;

import static org.junit.jupiter.api.Assertions.*;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class testFlashCard {
    private FlashCard fc1;
    private FlashCard fc2;

    @BeforeEach
    void runBefore() {
        fc1 = new FlashCard("Eat", "Meat");
        fc2 = new FlashCard("Card", "Koodo");
    }

    @Test
    void testConstructor() {
        assertEquals("Eat", fc1.getQuestion());
        assertEquals("meat", fc1.getAnswer());
        assertEquals("Card", fc2.getQuestion());
        assertEquals("koodo", fc2.getAnswer());
    }

    @Test
    void testCheckAnswer() {
        assertTrue(fc1.checkAnswer(fc1.getAnswer()));
        assertTrue(fc1.getStatusAnswer());
        assertFalse(fc2.checkAnswer(fc1.getAnswer()));
        assertFalse(fc2.getStatusAnswer());

    }

    @Test
    void testMarkAsReviewed() {
        fc2.markStatusAlreadyReview();
        assertTrue(fc2.getStatusAnswer());
        fc1.markStatusAlreadyReview();
        assertTrue(fc1.getStatusAnswer());
        fc1.markStatusAlreadyReview();
        assertTrue(fc1.getStatusAnswer());
    }
}
