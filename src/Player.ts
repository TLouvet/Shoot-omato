import { INITIAL_AMMO } from "./constants";
import { HTMLInterface } from "./HtmlRenderer";

export class Player {
  private _ammo: number;
  private _score: number;
  private _bestScore: number;

  constructor() {
    this._ammo = INITIAL_AMMO;
    this._score = 0;
    this._bestScore = 0;
  }

  init() {
    this._ammo = INITIAL_AMMO;
    this._score = 0;
    HTMLInterface.update('score', String(this._score));
    HTMLInterface.update('ammo', String(this._ammo));
  }

  hit(points: number) {
    this._score += points;
    HTMLInterface.update('score', String(this._score));
  }

  shoot() {
    this._ammo -= 1;
    HTMLInterface.update('ammo', String(this._ammo));
  }

  get score() {
    return this._score;
  }

  get ammo() {
    return this._ammo;
  }

  get bestScore() {
    return this._bestScore;
  }

  canShoot() {
    return this._ammo > 0;
  }
}