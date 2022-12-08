export class FPSMonitor {
  private static fpsCount = 0;
  private static _FPS = 60;
  private static _TOLERANCE_DELAY = 0.1;
  private static _INTERVAL = (1000 / this._FPS) + this._TOLERANCE_DELAY;
  private static isLoggingInterval = false;
  private static intervalId: number | null;

  private constructor() { }

  // Quite useless atm as fpscount is never updated
  static logFPSInterval() {
    if (this.isLoggingInterval) {
      return;
    }

    this.isLoggingInterval = true;
    this.intervalId = setInterval(() => {
      console.log("fps", this.fpsCount);
      this.fpsCount = Math.max(0, this.fpsCount - this._FPS);
    }, 1000);
  }

  static removeFPSLog() {
    if (!this.intervalId) {
      return;
    }

    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  static get FPSGoal() {
    return this._FPS;
  }

  static get MaxFPSInterval() {
    return this._INTERVAL;
  }

}