export class FPSMonitor {
  private static fpsCount: number = 0;
  private static _FPS = 60;
  private static _TOLERANCE_DELAY = 0.1;
  private static _INTERVAL = (1000 / this._FPS) + this._TOLERANCE_DELAY;

  private constructor() { }

  /**
   * Display FPS in console each second
   */
  static logFPSInterval() {
    const intervalId = setInterval(() => {
      console.log("fps", this.fpsCount);
      this.fpsCount = Math.max(0, this.fpsCount - this._FPS);
    }, 1000)

    return intervalId;
  }

  static get FPSGoal() {
    return this._FPS;
  }

  static get Interval() {
    return this._INTERVAL;
  }

}