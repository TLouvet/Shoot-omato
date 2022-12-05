import { SCREEN_HEIGHT, SCREEN_WIDTH, SPRITE_HEIGHT, SPRITE_WIDTH, TOMATO_IMAGE_URL } from "./constants";
import { SpeedComponent } from "./components/SpeedComponent";
import { Coords2D } from "./types";

export class Tomato implements Coords2D {
  private sprite: HTMLImageElement;
  x!: number;
  y!: number;
  private VelocityComponent: SpeedComponent;

  constructor() {
    this.sprite = new Image();
    this.sprite.src = TOMATO_IMAGE_URL;
    this.centerOnScreen();
    this.VelocityComponent = new SpeedComponent();
  }

  private centerOnScreen() {
    this.x = (SCREEN_WIDTH / 2) - (SPRITE_WIDTH / 2);
    this.y = (SCREEN_HEIGHT / 2) - (SPRITE_HEIGHT / 2);
  }

  init() {
    this.centerOnScreen();
    this.VelocityComponent.init();
  }

  setInitialVel() {
    this.VelocityComponent.setInitialVel();
  }

  stop() {
    this.centerOnScreen();
    this.VelocityComponent.stop();
  }

  move() {
    this.x += this.VelocityComponent.velX;
    this.y += this.VelocityComponent.velY;

    if (this.collideX()) {
      this.x = 0;
      this.VelocityComponent.changeVel("velX");
    }

    if (this.collideW()) {
      this.x = SCREEN_WIDTH - SPRITE_WIDTH;
      this.VelocityComponent.changeVel("velX");
    }

    if (this.collideY()) {
      this.y = 0;
      this.VelocityComponent.changeVel("velY");
    }

    if (this.collideH()) {
      this.y = SCREEN_HEIGHT - SPRITE_HEIGHT;
      this.VelocityComponent.changeVel("velY");
    }
  }

  private collideX() {
    return this.x <= 0;
  }

  private collideW() {
    return this.x + SPRITE_WIDTH >= SCREEN_WIDTH;
  }

  private collideY() {
    return this.y <= 0;
  }

  private collideH() {
    return this.y + SPRITE_HEIGHT >= SCREEN_HEIGHT;
  }

  getCoords() {
    return { x: this.x, y: this.y };
  }

  increaseVelocity() {
    this.VelocityComponent.addBonus();
  }

  __debugStop() {
    this.VelocityComponent.stop();
  }

  __debugInit() {
    this.VelocityComponent.init();
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.sprite, this.x, this.y, SPRITE_WIDTH, SPRITE_HEIGHT);
  }
}
