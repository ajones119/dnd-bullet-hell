import { Engine } from "excalibur";

    export class PauseMenu {
        private menuElement: HTMLDivElement | null = null;
        private continueButton: HTMLButtonElement | null = null;

    constructor(private engine: Engine) {
        this.loadMenu();

    }

    private async loadMenu() {
        try {
        const response = await fetch("/html/pause-menu.html");
        const menuHtml = await response.text();

        const menuContainer = document.createElement("div");
        menuContainer.innerHTML = menuHtml;
        document.body.appendChild(menuContainer);

        this.menuElement = document.getElementById("pauseMenu") as HTMLDivElement;
        this.continueButton = document.getElementById("continueButton") as HTMLButtonElement;

        this.setupEventListeners();
        } catch (error) {
        console.error("Failed to load level-up menu:", error);
        }
    }

    private setupEventListeners() {
        if (!this.menuElement || !this.continueButton) return;

        this.continueButton.addEventListener("click", () => this.hide());

    }

    show() {
        if (this.menuElement) {
            this.menuElement.style.display = "block";
            this.engine.stop()
        }
    }

    hide() {
        if (this.menuElement) {
            this.menuElement.style.display = "none";
            this.engine.start()
        }
    }

}
