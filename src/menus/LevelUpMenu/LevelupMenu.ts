import { Engine } from "excalibur";
import { Player, WeaponIds } from "../../Actors/players/player";

export class LevelUpMenu {
  private menuElement: HTMLDivElement | null = null;
  private closeMenuButton: HTMLButtonElement | null = null;
  private availableWeapons: WeaponIds[] = ["dagger", "magicMissle", "shield"];

  constructor(private engine: Engine) {}

  private async loadMenu() {
    try {
      const response = await fetch("/html/level-up-menu.html");
      const menuHtml = await response.text();
  
      const menuContainer = document.createElement("div");
      menuContainer.innerHTML = menuHtml;
      document.body.appendChild(menuContainer);
  
      this.menuElement = document.getElementById("levelUpMenu") as HTMLDivElement;
      this.closeMenuButton = document.getElementById("closeMenu") as HTMLButtonElement;
  
      this.setupEventListeners();
    } catch (error) {
      console.error("Failed to load level-up menu:", error);
    }
  }

  private setupEventListeners() {
    if (!this.menuElement || !this.closeMenuButton) return;

    this.closeMenuButton.addEventListener("click", () => this.hide());
  }

  show(player: Player) {
    this.loadMenu();
    if (this.menuElement) {
      this.engine.stop();
      this.menuElement.style.display = "block";

      const menuOptions = document.getElementById("menuOptions");
      if (!menuOptions) return;

      // Clear existing options
      menuOptions.innerHTML = "";

      // Health and Speed Options
      const healthButton = this.createOptionButton("Increase Health", () => {
        player.maxHealthBonus += 0.1;
        this.hide();
      });

      const speedButton = this.createOptionButton("Increase Speed", () => {
        player.speedBonus += 0.1;
        this.hide();
      });

      menuOptions.appendChild(healthButton);
      menuOptions.appendChild(speedButton);

      // Random Weapon Selection
      const shuffledWeapons = this.availableWeapons.sort(() => 0.5 - Math.random()).slice(0, 2);
      shuffledWeapons.forEach((weapon) => {
        const weaponButton = this.createOptionButton(`Level Up ${weapon}`, () => {
          player.levelWeapon(weapon);
          this.hide();
        });
        menuOptions.appendChild(weaponButton);
      });
    }
  }

  private createOptionButton(text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", onClick);
    return button;
  }

  hide() {
    if (this.menuElement) {
      this.engine.start();
      this.menuElement.style.display = "none";
    }
  }
}
