package mvc.view;

import mvc.model.Hero;

public class HeroView {
    public void printHeroDetails(Hero hero) {
        System.out.println("--- Hero Details ---");
        System.out.println("Name: " + hero.getName());
        System.out.println("Power: " + hero.getPower());
        System.out.println("--------------------");
    }
}
