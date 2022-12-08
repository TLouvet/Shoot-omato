import { FAIL_SOUND, HIT_SOUND, SCREEN_HEIGHT, SCREEN_WIDTH, SPRITE_HEIGHT, SPRITE_WIDTH, TOMATO_IMAGE_URL } from "./constants";
import { HTMLInterface } from "./HtmlInterface";
import { FPSMonitor } from "./Monitor";
import { Player } from "./Player";
import { SoundManager } from "./SoundManager";
import { Tomato } from "./Tomato";
import { Coords2D, Drawable } from "./types";

const tomato = new Tomato(SPRITE_WIDTH, SPRITE_HEIGHT);
const player = new Player();
const drawables = [] as Drawable[];
let isPlaying = false;
let lastTime = 0;

document.getElementById('play-btn')?.addEventListener('click', () => {
  (document.getElementById('play-btn') as HTMLButtonElement).disabled = true;
  play();
})

function main() {
  initCanvasListener();
  tomato.setSpriteSource(TOMATO_IMAGE_URL);
  drawables.push(tomato);
  const context = getContext()
  context.fillStyle = 'black';
  gameLoop(0);
}

main();

function isOverlapping(mouse: Coords2D, tomato: Coords2D) {
  return mouse.x >= tomato.x && mouse.x <= tomato.x + SPRITE_WIDTH && mouse.y >= tomato.y && mouse.y <= tomato.y + SPRITE_HEIGHT;
}

function getMouseRelativeToCanvas(mouse: MouseEvent): Coords2D {
  const canvas = getCanvas();
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
  const canvas = getCanvas();
  canvas.addEventListener('click', (event) => {

    if (isPlaying && tomato.canBeHit()) {
      const mouseCoords = getMouseRelativeToCanvas(event);
      const tomatoBounds = tomato.getBounds();

      if (isOverlapping(mouseCoords, tomatoBounds)) {
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

function getCanvas() {
  return HTMLInterface.getQuerySelector('canvas') as HTMLCanvasElement;
}

function getContext() {
  const canvas = getCanvas();
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("context not available");
  }
  return context;
}

function gameLoop(time: number) {
  const context = getContext();

  if (lastTime != null) {
    const delta = time - lastTime;
    // This way we cap FPS to a maximum
    if (delta >= FPSMonitor.MaxFPSInterval) {
      context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      tomato.move(delta);
      HTMLInterface.drawObjects(drawables)
      lastTime = time;
    }
  }
  window.requestAnimationFrame(gameLoop);
}