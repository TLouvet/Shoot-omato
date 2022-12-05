import { FAIL_SOUND, HIT_SOUND, INITIAL_AMMO, SPRITE_HEIGHT, SPRITE_WIDTH } from "./constants";
import { HTMLInterface } from "./HtmlRenderer";
import { Player } from "./Player";
import { SoundManager } from "./SoundManager";
import { Tomato } from "./Tomato";
import { Coords2D } from "./types";

const tomato = new Tomato();
const player = new Player();
let isPlaying = false;

document.getElementById('play-btn')?.addEventListener('click', () => {
  (document.getElementById('play-btn') as HTMLButtonElement).disabled = true;
  play();
})

function main() {
  HTMLInterface.update('ammo', String(INITIAL_AMMO));
  initCanvasListener();
  const context = getContext()
  context.fillStyle = 'black';
  gameLoop(context);
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

    if (player.canShoot() && isPlaying) {
      player.shoot();
      const mouseCoords = getMouseRelativeToCanvas(event);
      const tomatoCoords = tomato.getCoords();
      if (isOverlapping(mouseCoords, tomatoCoords)) {
        player.hit(1);
        tomato.increaseVelocity();
        SoundManager.play(HIT_SOUND);
      } else {
        SoundManager.play(FAIL_SOUND);
      }
    }

    // Must verify after -- probably should be reorganized
    if (!player.canShoot()) {
      tomato.stop();
      isPlaying = false;
      HTMLInterface.update('b-score', String(Math.max(player.score, player.bestScore)));
      (document.getElementById('play-btn') as HTMLButtonElement).disabled = false;
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

function gameLoop(context: CanvasRenderingContext2D) {
  context!.fillRect(0, 0, 800, 600);
  tomato.move();
  tomato.draw(context as CanvasRenderingContext2D); // Not sure about this one
  window.requestAnimationFrame(() => gameLoop(context));
}
