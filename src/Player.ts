import { HTMLInterface } from "./HtmlInterface";

export class Player {
  private _score: number;
  private _bestScore: number;
  private _combo: number;

  constructor() {
    this._score = 0;
    this._bestScore = 0;
    this._combo = 1;
  }

  init() {
    this._score = 0;
    this._combo = 1;
    HTMLInterface.update('score', String(this._score));
  }

  hit(points: number) {
    this._score += Math.round(points * this._combo);
    this._combo++;
    HTMLInterface.update('score', String(this._score));
    HTMLInterface.update('combo', String(this._combo));
  }


  resetCombo() {
    this._combo = 1;
    HTMLInterface.update('combo', String(this._combo));
  }

  get score() {
    return this._score;
  }

  get bestScore() {
    return this._bestScore;
  }

  setBestScore() {
    this._bestScore = Math.max(this._bestScore, this._score);
  }

}