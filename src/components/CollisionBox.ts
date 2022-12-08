import { DEFAULT_INVINCIBLE_TIME, SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants";
// import { Coords2D } from "../types";
import { CoordsComponent } from "./CoordsComponent";

// WIP
export class CollisionBox {
  private _canBeHit: boolean;
  private CoordsComponent: CoordsComponent;

  constructor(coords: CoordsComponent) {
    this._canBeHit = true;
    this.CoordsComponent = coords;
  }

  // isOverlapping(otherObject: Coords2D) {

  // }

  get canBeHit() {
    return this._canBeHit;
  }

  handleHit() {
    this._canBeHit = false;
    setTimeout(() => {
      this._canBeHit = true;
    }, DEFAULT_INVINCIBLE_TIME);
  }

  collideXAxis() {
    return this.collideScreenX() || this.collideScreenW();
  }

  private collideScreenX() {
    return this.CoordsComponent.x <= 0;
  }

  private collideScreenW() {
    return this.CoordsComponent.x + this.CoordsComponent.width >= SCREEN_WIDTH;
  }

  collideYAxis() {
    return this.collideScreenY() || this.collideScreenH();
  }

  private collideScreenY() {
    return this.CoordsComponent.y <= 0;
  }

  private collideScreenH() {
    return this.CoordsComponent.y + this.CoordsComponent.height >= SCREEN_HEIGHT;
  }
}