export interface Coords2D {
  x: number;
  y: number;
}

export interface Velocity {
  velY: number;
  velX: number;
}

export interface Drawable {
  sprite: HTMLImageElement;
  getDrawInformations(): any;
}