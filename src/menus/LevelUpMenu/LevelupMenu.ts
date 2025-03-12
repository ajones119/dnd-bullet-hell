import { Engine } from "excalibur";
import { Player } from "../../Actors/players/player";

export class LevelUpMenu {
    private menuElement: HTMLDivElement | null = null;
    private increaseHealthButton: HTMLButtonElement | null = null;
    private increaseSpeedButton: HTMLButtonElement | null = null;
    private closeMenuButton: HTMLButtonElement | null = null;
    private onHealthIncrease: (() => void) | null = null;
    private onSpeedIncrease: (() => void) | null = null;
  
    constructor(private engine: Engine) {
      this.loadMenu();
    }
  
    private async loadMenu() {
      try {
        const response = await fetch("/html/level-up-menu.html");
        const menuHtml = await response.text();
  
        const menuContainer = document.createElement("div");
        menuContainer.innerHTML = menuHtml;
        document.body.appendChild(menuContainer);
  
        this.menuElement = document.getElementById("levelUpMenu") as HTMLDivElement;
        this.increaseHealthButton = document.getElementById("increaseHealth") as HTMLButtonElement;
        this.increaseSpeedButton = document.getElementById("increaseSpeed") as HTMLButtonElement;
        this.closeMenuButton = document.getElementById("closeMenu") as HTMLButtonElement;
  
        this.setupEventListeners();
      } catch (error) {
        console.error("Failed to load level-up menu:", error);
      }
    }
  
    private setupEventListeners() {
      if (!this.menuElement || !this.increaseHealthButton || !this.increaseSpeedButton || !this.closeMenuButton) return;
  
      this.closeMenuButton.addEventListener("click", () => this.hide());
  
      this.increaseHealthButton.addEventListener("click", () => {
        if (this.onHealthIncrease) this.onHealthIncrease();
        this.hide();
      });
  
      this.increaseSpeedButton.addEventListener("click", () => {
        if (this.onSpeedIncrease) this.onSpeedIncrease();
        this.hide();
      });
    }
  
    show(player: Player) {
      if (this.menuElement) {
        this.engine.stop();
        this.onHealthIncrease = () => {player.maxHealthBonus += 0.1}
        this.onSpeedIncrease = () => {player.speedBonus += 0.1}
        this.menuElement.style.display = "block";
      }
    }
  
    hide() {
      if (this.menuElement) {
        this.engine.start();
        this.menuElement.style.display = "none";
      }
    }
  
    setHealthIncreaseCallback(callback: () => void) {
      this.onHealthIncrease = callback;
    }
  
    setSpeedIncreaseCallback(callback: () => void) {
      this.onSpeedIncrease = callback;
    }
  }
  