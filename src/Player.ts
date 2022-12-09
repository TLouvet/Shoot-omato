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
  }

  hit(points: number) {
    this._score += Math.round(points * this._combo);
    this._combo++;
  }

  resetCombo() {
    this._combo = 1;
  }

  get score() {
    return this._score;
  }

  get bestScore() {
    return this._bestScore;
  }

  get combo() {
    return this._combo;
  }

  setBestScore() {
    this._bestScore = Math.max(this._bestScore, this._score);
  }

}