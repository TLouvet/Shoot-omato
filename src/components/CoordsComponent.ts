import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants";
import { Coords2D } from "../types";

export class CoordsComponent implements Coords2D {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.centerOnScreen();
  }

  updateOnMove(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
  }

  setX(newX: number) {
    this.x = newX;
  }

  setY(newY: number) {
    this.y = newY;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      w: this.x + this.width,
      h: this.y + this.height
    };
  }

  centerOnScreen() {
    this.x = (SCREEN_WIDTH / 2) - (this.width / 2);
    this.y = (SCREEN_HEIGHT / 2) - (this.height / 2);
  }
}