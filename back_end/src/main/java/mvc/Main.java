  package mvc;

import mvc.controller.HeroController;
import mvc.model.Hero;
import mvc.view.HeroView;

public class Main {
    public static void main(String[] args) {
        // Fetch hero record (simulating a database fetch)
        Hero model = retrieveHeroFromDatabase();

        // Create a view to write hero details on console
        HeroView view = new HeroView();

        // Create controller
        HeroController controller = new HeroController(model, view);

        // Display initial details
        controller.updateView();

        // Update model data
        controller.setHeroName("Batman");
        controller.setHeroPower("Intelligence, Martial Arts, Wealth");

        // Display updated details
        System.out.println("\nAfter updating hero record in the Controller...\n");
        controller.updateView();
    }

    private static Hero retrieveHeroFromDatabase() {
        return new Hero("Superman", "Super strength, flight, heat vision");
    }
}
