import { DEFAULT_VELOCITY_BONUS, MINIMUM_SPEED } from "../constants";
import { Velocity } from "../types";

export class SpeedComponent implements Velocity {
  velX: number;
  velY: number;
  velocityBonus: number;

  constructor() {
    this.velX = 0;
    this.velY = 0;
    this.velocityBonus = 0;
  }

  init() {
    this.velX = this.setInitialVel();
    this.velY = this.setInitialVel();
    this.velocityBonus = 0;
  }

  setInitialVel() {
    const positive = Math.random() > 0.5 ? true : false;
    if (positive) {
      return Math.max(this.MinimumVelocity, this.MaximumVelocity);
    }
    return Math.min(-this.MinimumVelocity, -this.MaximumVelocity);
  }

  inverseVel(vel: keyof Velocity) {
    if (this[vel] < 0) {
      this[vel] = Math.max(this.MinimumVelocity, this.MaximumVelocity);
    } else {
      this[vel] = Math.min(-this.MinimumVelocity, -this.MaximumVelocity);
    }
  }

  accelerate() {
    this.updateVel('velX');
    this.updateVel('velY');
  }

  private updateVel(vel: keyof Velocity) {
    if (this[vel] < 0) {
      this[vel] = Math.min(-this.MinimumVelocity, -this.MaximumVelocity);
    } else {
      this[vel] = Math.max(this.MinimumVelocity, this.MaximumVelocity);
    }
  }

  private get MinimumVelocity() {
    return MINIMUM_SPEED + this.velocityBonus;
  }

  private get MaximumVelocity() {
    return this.MinimumVelocity + Math.random() * 0.5;
  }

  getValues(): Velocity {
    return { velX: this.velX, velY: this.velY };
  }

  addBonus() {
    this.velocityBonus += DEFAULT_VELOCITY_BONUS;
  }

  stop() {
    this.velX = 0;
    this.velY = 0;
  }
}