import { FAIL_SOUND, HIT_SOUND, SPRITE_HEIGHT, SPRITE_WIDTH } from "./constants";
import { HTMLInterface } from "./HtmlRenderer";
import { FPSMonitor } from "./Monitor";
import { Player } from "./Player";
import { SoundManager } from "./SoundManager";
import { Tomato } from "./Tomato";
import { Coords2D } from "./types";

const tomato = new Tomato();
const player = new Player();
let isPlaying = false;

// let then = Date.now();
let lastTime = 0;

document.getElementById('play-btn')?.addEventListener('click', () => {
  (document.getElementById('play-btn') as HTMLButtonElement).disabled = true;
  play();
})

function main() {
  initCanvasListener();
  const context = getContext()
  context.fillStyle = 'black';
  gameLoop(context, 0);
}

main();

function isOverlapping(mouse: Coords2D, tomato: Coords2D) {
  return mouse.x >= tomato.x && mouse.x <= tomato.x + SPRITE_WIDTH && mouse.y >= tomato.y && mouse.y <= tomato.y + SPRITE_HEIGHT;
}

function getMouseRelativeToCanvas(mouse: MouseEvent): Coords2D {
  const canvas = HTMLInterface.getQuerySelector('canvas');
  const canvasBox = canvas.getBoundingClientRect();
  const mouseX = mouse.clientX - canvasBox.x;
  const mouseY = mouse.clientY - canvasBox.y;
  return { x: mouseX, y: mouseY };
}

function play() {
  tomato.init();
  player.init();
  isPlaying = true;
}

function initCanvasListener() {
  const canvas = HTMLInterface.getQuerySelector('canvas') as HTMLCanvasElement;
  canvas.addEventListener('click', (event) => {

    if (isPlaying && tomato.canBeHit) {
      const mouseCoords = getMouseRelativeToCanvas(event);
      const tomatoCoords = tomato.getCoords();

      if (isOverlapping(mouseCoords, tomatoCoords)) {
        const { velX, velY } = tomato.getVelocity();
        const score = ((1 + Math.abs(velX)) * (1 + Math.abs(velY))) * 10;
        player.hit(score);
        tomato.takeHit();
        SoundManager.play(HIT_SOUND);
      } else {
        player.resetCombo();
        tomato.stop();
        isPlaying = false;
        player.setBestScore();
        HTMLInterface.update('b-score', String(Math.max(player.score, player.bestScore)));
        (document.getElementById('play-btn') as HTMLButtonElement).disabled = false;
        SoundManager.play(FAIL_SOUND);
      }
    }
  })
}

function getContext() {
  const canvas = HTMLInterface.getQuerySelector('canvas') as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("context not available");
  }
  return context;
}

function gameLoop(context: CanvasRenderingContext2D, time: number) {
  // const now = Date.now();
  // const elapsedTime = now - then;
  // if (elapsedTime >= FPSMonitor.Interval) {
  //   console.log(elapsedTime);
  //   then = now - (elapsedTime % (FPSMonitor.Interval));
  //   context!.fillRect(0, 0, 800, 600);
  //   tomato.move(elapsedTime);
  //   tomato.draw(context as CanvasRenderingContext2D);
  // }
  if (lastTime != null) {
    const delta = time - lastTime;
    // Seulement si delta > FPS.INTERVAL (1000/60) + 0.1
    if (delta >= FPSMonitor.MaxFPSInterval) {
      context!.fillRect(0, 0, 800, 600);
      tomato.move(delta);
      tomato.draw(context as CanvasRenderingContext2D);
      lastTime = time;
    }
  }
  window.requestAnimationFrame((time) => gameLoop(context, time));
}
