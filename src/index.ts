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

function main() {
  initPlayButton();
  initCanvasListener();
  tomato.setSpriteSource(TOMATO_IMAGE_URL);
  drawables.push(tomato);
  const context = HTMLInterface.getContext();
  context.fillStyle = 'black';
  gameLoop(0);
}

main();

function initCanvasListener() {
  const canvas = getCanvas();
  canvas.addEventListener('click', (event) => {
    if (isPlaying && tomato.canBeHit()) {
      const mouseCoords = getMouseRelativeToCanvas(event);
      const tomatoBounds = tomato.getBounds();
      if (isOverlapping(mouseCoords, tomatoBounds)) {
        handleHit();
      } else {
        handleEndgame();
      }
    }
  })
}

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

function getCanvas() {
  return HTMLInterface.getQuerySelector('canvas') as HTMLCanvasElement;
}

function initPlayButton() {
  const playButton = HTMLInterface.getQuerySelector('#play-btn') as HTMLButtonElement;
  playButton.addEventListener('click', () => {
    playButton.disabled = true;
    play();
  });
}

function play() {
  tomato.init();
  player.init();
  HTMLInterface.update('score', String(player.score));
  isPlaying = true;
}

function handleHit() {
  const { velX, velY } = tomato.getVelocity();
  const score = ((1 + Math.abs(velX)) * (1 + Math.abs(velY))) * 10;
  player.hit(score);
  tomato.takeHit();
  HTMLInterface.update('score', String(player.score));
  HTMLInterface.update('combo', String(player.combo));
  SoundManager.play(HIT_SOUND);
}

function handleEndgame() {
  player.resetCombo();
  tomato.stop();
  isPlaying = false;
  player.setBestScore();
  HTMLInterface.update('b-score', String(Math.max(player.score, player.bestScore)));
  HTMLInterface.update('combo', String(player.combo));
  (document.getElementById('play-btn') as HTMLButtonElement).disabled = false;
  SoundManager.play(FAIL_SOUND);
}

function gameLoop(time: number) {
  if (lastTime != null) {
    const delta = time - lastTime;
    if (delta >= FPSMonitor.MaxFPSInterval) {
      draw(delta);
      lastTime = time;
    }
  }
  window.requestAnimationFrame(gameLoop);
}

function draw(delta: number) {
  const context = HTMLInterface.getContext();
  context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  tomato.move(delta);
  HTMLInterface.drawObjects(drawables)
}