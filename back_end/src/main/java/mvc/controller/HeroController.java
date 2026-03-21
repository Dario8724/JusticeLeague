package mvc.controller;

import mvc.model.Hero;
import mvc.view.HeroView;

public class HeroController {
    private Hero model;
    private HeroView view;

    public HeroController(Hero model, HeroView view) {
        this.model = model;
        this.view = view;
    }

    public void setHeroName(String name) {
        model.setName(name);
    }

    public String getHeroName() {
        return model.getName();
    }

    public void setHeroPower(String power) {
        model.setPower(power);
    }

    public String getHeroPower() {
        return model.getPower();
    }

    public void updateView() {
        view.printHeroDetails(model);
    }
}
