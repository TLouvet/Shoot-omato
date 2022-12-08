export class SoundManager {
  private constructor() { }
  static player = new Audio();
  static isPlaying = false;

  static play(sound: string) {
    if (this.isPlaying) {
      this.player.pause();
    }

    this.player.src = sound;
    this.player.play();
    this.isPlaying = false;
  }
}