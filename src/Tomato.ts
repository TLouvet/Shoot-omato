import { DEFAULT_INVINCIBLE_TIME, SCREEN_HEIGHT, SCREEN_WIDTH, SPRITE_HEIGHT, SPRITE_WIDTH, TOMATO_IMAGE_URL } from "./constants";
import { SpeedComponent } from "./components/SpeedComponent";
import { Coords2D } from "./types";

export class Tomato implements Coords2D {
  private sprite: HTMLImageElement;
  x!: number;
  y!: number;
  private VelocityComponent: SpeedComponent;
  private _canBeHit: boolean;

  constructor() {
    this.sprite = new Image();
    this.sprite.src = TOMATO_IMAGE_URL;
    this.centerOnScreen();
    this.VelocityComponent = new SpeedComponent();
    this._canBeHit = true;
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

  move(elapsedTime: number) {
    this.x += this.VelocityComponent.velX * elapsedTime; // keep constant even if framerate changes
    this.y += this.VelocityComponent.velY * elapsedTime;

    if (this.collideX()) {
      this.x = 0;
      this.VelocityComponent.inverseVel("velX");
    }

    if (this.collideW()) {
      this.x = SCREEN_WIDTH - SPRITE_WIDTH;
      this.VelocityComponent.inverseVel("velX");
    }

    if (this.collideY()) {
      this.y = 0;
      this.VelocityComponent.inverseVel("velY");
    }

    if (this.collideH()) {
      this.y = SCREEN_HEIGHT - SPRITE_HEIGHT;
      this.VelocityComponent.inverseVel("velY");
    }
  }

  get canBeHit() {
    return this._canBeHit;
  }

  takeHit() {
    this.VelocityComponent.addBonus();
    this.VelocityComponent.accelerate();
    this._canBeHit = false;
    setTimeout(() => {
      this._canBeHit = true;
    }, DEFAULT_INVINCIBLE_TIME);
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

  getVelocity() {
    return this.VelocityComponent.getValues();
  }

  __debugStop() {
    this.VelocityComponent.stop();
  }

  __debugInit() {
    this.VelocityComponent.init();
  }

  draw(context: CanvasRenderingContext2D) {
    if (!this.canBeHit) {
      return;
    }
    context.drawImage(this.sprite, this.x, this.y, SPRITE_WIDTH, SPRITE_HEIGHT);
  }
}
