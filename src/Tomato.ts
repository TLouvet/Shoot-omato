import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants";
import { SpeedComponent } from "./components/SpeedComponent";
import { CoordsComponent } from "./components/CoordsComponent";
import { CollisionBox } from "./components/CollisionBox";
import { Drawable } from "./types";

export class Tomato implements Drawable {
  sprite: HTMLImageElement;
  private VelocityComponent: SpeedComponent;
  private CoordsComponent: CoordsComponent;
  private CollisionBox: CollisionBox;

  constructor(width: number, height: number) {
    this.sprite = new Image();
    this.VelocityComponent = new SpeedComponent();
    this.CoordsComponent = new CoordsComponent(width, height);
    this.CollisionBox = new CollisionBox(this.CoordsComponent);
  }

  init() {
    this.CoordsComponent.centerOnScreen();
    this.VelocityComponent.init();
  }

  setSpriteSource(src: string) {
    this.sprite.src = src;
  }

  setInitialVel() {
    this.VelocityComponent.setInitialVel();
  }

  stop() {
    this.CoordsComponent.centerOnScreen();
    this.VelocityComponent.stop();
  }

  move(elapsedTime: number) {
    const { xPosition, yPosition } = this.getUpdatedPositionValues(elapsedTime);
    this.CoordsComponent.updateOnMove(xPosition, yPosition);
    this.handleCollisions();
  }

  private getUpdatedPositionValues(elapsedTime: number) {
    const { x, y } = this.CoordsComponent.getBounds();
    const { velX, velY } = this.VelocityComponent.getValues();
    const xPosition = x + velX * elapsedTime;
    const yPosition = y + velY * elapsedTime;
    return { xPosition, yPosition };
  }

  takeHit() {
    this.VelocityComponent.addBonus();
    this.VelocityComponent.accelerate();
    this.CollisionBox.handleHit();
  }

  private handleCollisions() {
    this.onHorizontalCollision();
    this.onVerticalCollision();
  }

  private onHorizontalCollision() {
    if (!this.CollisionBox.collideXAxis()) {
      return;
    }

    const correctedX = this.CoordsComponent.x <= 0 ? 0 : SCREEN_WIDTH - this.CoordsComponent.width;
    this.VelocityComponent.inverseVel("velX");
    this.CoordsComponent.setX(correctedX);
  }

  private onVerticalCollision() {
    if (!this.CollisionBox.collideYAxis()) {
      return;
    }

    const correctedY = this.CoordsComponent.y <= 0 ? 0 : SCREEN_HEIGHT - this.CoordsComponent.height;
    this.VelocityComponent.inverseVel("velY");
    this.CoordsComponent.setY(correctedY);
  }

  canBeHit() {
    return this.CollisionBox.canBeHit;
  }

  getBounds() {
    return this.CoordsComponent.getBounds();
  }

  getVelocity() {
    return this.VelocityComponent.getValues();
  }

  getDrawInformations() {
    return {
      sprite: this.sprite,
      x: this.CoordsComponent.x,
      y: this.CoordsComponent.y,
      width: this.CoordsComponent.width,
      height: this.CoordsComponent.height,
      canDraw: this.CollisionBox.canBeHit
    }
  }
}
