(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLInterface = void 0;
class HTMLInterface {
    constructor() { }
    static update(id, content) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Error: Element with id ${id} not found`);
        }
        element.innerText = content;
    }
    static getQuerySelector(query) {
        const tag = document.querySelector(query);
        if (!tag) {
            throw new Error(`No Element corresponds to '${query}' on the DOM.`);
        }
        return tag;
    }
}
exports.HTMLInterface = HTMLInterface;

},{}],2:[function(require,module,exports){
"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FPSMonitor = void 0;
class FPSMonitor {
    constructor() { }
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
exports.FPSMonitor = FPSMonitor;
_a = FPSMonitor;
FPSMonitor.fpsCount = 0;
FPSMonitor._FPS = 60;
FPSMonitor._TOLERANCE_DELAY = 0.1;
FPSMonitor._INTERVAL = (1000 / _a._FPS) + _a._TOLERANCE_DELAY;
FPSMonitor.isLoggingInterval = false;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const HtmlRenderer_1 = require("./HtmlRenderer");
class Player {
    constructor() {
        this._score = 0;
        this._bestScore = 0;
        this._combo = 1;
    }
    init() {
        this._score = 0;
        this._combo = 1;
        HtmlRenderer_1.HTMLInterface.update('score', String(this._score));
    }
    hit(points) {
        this._score += Math.round(points * this._combo);
        this._combo++;
        HtmlRenderer_1.HTMLInterface.update('score', String(this._score));
        HtmlRenderer_1.HTMLInterface.update('combo', String(this._combo));
    }
    resetCombo() {
        this._combo = 1;
        HtmlRenderer_1.HTMLInterface.update('combo', String(this._combo));
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
exports.Player = Player;

},{"./HtmlRenderer":1}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundManager = void 0;
class SoundManager {
    constructor() { }
    static play(sound) {
        if (this.isPlaying) {
            this.player.pause();
        }
        this.player.src = sound;
        this.player.play();
        this.isPlaying = false;
    }
}
exports.SoundManager = SoundManager;
SoundManager.player = new Audio();
SoundManager.isPlaying = false;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tomato = void 0;
const constants_1 = require("./constants");
const SpeedComponent_1 = require("./components/SpeedComponent");
class Tomato {
    constructor() {
        this.sprite = new Image();
        this.sprite.src = constants_1.TOMATO_IMAGE_URL;
        this.centerOnScreen();
        this.VelocityComponent = new SpeedComponent_1.SpeedComponent();
        this._canBeHit = true;
    }
    centerOnScreen() {
        this.x = (constants_1.SCREEN_WIDTH / 2) - (constants_1.SPRITE_WIDTH / 2);
        this.y = (constants_1.SCREEN_HEIGHT / 2) - (constants_1.SPRITE_HEIGHT / 2);
    }
    init() {
        this.centerOnScreen();
        this.VelocityComponent.init();
    }
    setInitialVel() {
        this.VelocityComponent.setInitialVel();
    }
    stop() {
        this.centerOnScreen();
        this.VelocityComponent.stop();
    }
    move(elapsedTime) {
        this.x += this.VelocityComponent.velX * elapsedTime; // keep constant even if framerate changes
        this.y += this.VelocityComponent.velY * elapsedTime;
        if (this.collideX()) {
            this.x = 0;
            this.VelocityComponent.inverseVel("velX");
        }
        if (this.collideW()) {
            this.x = constants_1.SCREEN_WIDTH - constants_1.SPRITE_WIDTH;
            this.VelocityComponent.inverseVel("velX");
        }
        if (this.collideY()) {
            this.y = 0;
            this.VelocityComponent.inverseVel("velY");
        }
        if (this.collideH()) {
            this.y = constants_1.SCREEN_HEIGHT - constants_1.SPRITE_HEIGHT;
            this.VelocityComponent.inverseVel("velY");
        }
    }
    get canBeHit() {
        return this._canBeHit;
    }
    takeHit() {
        this.VelocityComponent.addBonus();
        this.VelocityComponent.accelerate();
        this._canBeHit = false;
        setTimeout(() => {
            this._canBeHit = true;
        }, constants_1.DEFAULT_INVINCIBLE_TIME);
    }
    collideX() {
        return this.x <= 0;
    }
    collideW() {
        return this.x + constants_1.SPRITE_WIDTH >= constants_1.SCREEN_WIDTH;
    }
    collideY() {
        return this.y <= 0;
    }
    collideH() {
        return this.y + constants_1.SPRITE_HEIGHT >= constants_1.SCREEN_HEIGHT;
    }
    getCoords() {
        return { x: this.x, y: this.y };
    }
    getVelocity() {
        return this.VelocityComponent.getValues();
    }
    __debugStop() {
        this.VelocityComponent.stop();
    }
    __debugInit() {
        this.VelocityComponent.init();
    }
    draw(context) {
        if (!this.canBeHit) {
            return;
        }
        context.drawImage(this.sprite, this.x, this.y, constants_1.SPRITE_WIDTH, constants_1.SPRITE_HEIGHT);
    }
}
exports.Tomato = Tomato;

},{"./components/SpeedComponent":6,"./constants":7}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeedComponent = void 0;
const constants_1 = require("../constants");
class SpeedComponent {
    constructor() {
        this.velX = 0;
        this.velY = 0;
        this.velocityBonus = 0;
    }
    init() {
        this.velX = this.setInitialVel();
        this.velY = this.setInitialVel();
        this.velocityBonus = 0;
    }
    setInitialVel() {
        const positive = Math.random() > 0.5 ? true : false;
        if (positive) {
            return Math.max(this.MinimumVelocity, this.MaximumVelocity);
        }
        return Math.min(-this.MinimumVelocity, -this.MaximumVelocity);
    }
    inverseVel(vel) {
        if (this[vel] < 0) {
            this[vel] = Math.max(this.MinimumVelocity, this.MaximumVelocity);
        }
        else {
            this[vel] = Math.min(-this.MinimumVelocity, -this.MaximumVelocity);
        }
    }
    accelerate() {
        this.updateVel('velX');
        this.updateVel('velY');
    }
    updateVel(vel) {
        if (this[vel] < 0) {
            this[vel] = Math.min(-this.MinimumVelocity, -this.MaximumVelocity);
        }
        else {
            this[vel] = Math.max(this.MinimumVelocity, this.MaximumVelocity);
        }
    }
    get MinimumVelocity() {
        return constants_1.MINIMUM_SPEED + this.velocityBonus;
    }
    get MaximumVelocity() {
        return this.MinimumVelocity + Math.random() * 0.5;
    }
    getValues() {
        return { velX: this.velX, velY: this.velY };
    }
    addBonus() {
        this.velocityBonus += constants_1.DEFAULT_VELOCITY_BONUS;
    }
    stop() {
        this.velX = 0;
        this.velY = 0;
    }
}
exports.SpeedComponent = SpeedComponent;

},{"../constants":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HIT_SOUND = exports.FAIL_SOUND = exports.DEFAULT_INVINCIBLE_TIME = exports.DEFAULT_VELOCITY_BONUS = exports.MINIMUM_SPEED = exports.TOMATO_IMAGE_URL = exports.SPRITE_HEIGHT = exports.SPRITE_WIDTH = exports.SCREEN_HEIGHT = exports.SCREEN_WIDTH = void 0;
exports.SCREEN_WIDTH = 800;
exports.SCREEN_HEIGHT = 600;
exports.SPRITE_WIDTH = 64;
exports.SPRITE_HEIGHT = 64;
exports.TOMATO_IMAGE_URL = './assets/tomato.png';
exports.MINIMUM_SPEED = 10 / 1000; // In px per seconds
exports.DEFAULT_VELOCITY_BONUS = 20 / 1000;
exports.DEFAULT_INVINCIBLE_TIME = 500; // in milliseconds
exports.FAIL_SOUND = "./assets/issou-el-risitas.mp3";
exports.HIT_SOUND = "./assets/hit.mp3";

},{}],8:[function(require,module,exports){
"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const HtmlRenderer_1 = require("./HtmlRenderer");
const Monitor_1 = require("./Monitor");
const Player_1 = require("./Player");
const SoundManager_1 = require("./SoundManager");
const Tomato_1 = require("./Tomato");
const tomato = new Tomato_1.Tomato();
const player = new Player_1.Player();
let isPlaying = false;
// let then = Date.now();
let lastTime = 0;
(_a = document.getElementById('play-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    document.getElementById('play-btn').disabled = true;
    play();
});
function main() {
    initCanvasListener();
    const context = getContext();
    context.fillStyle = 'black';
    gameLoop(context, 0);
}
main();
function isOverlapping(mouse, tomato) {
    return mouse.x >= tomato.x && mouse.x <= tomato.x + constants_1.SPRITE_WIDTH && mouse.y >= tomato.y && mouse.y <= tomato.y + constants_1.SPRITE_HEIGHT;
}
function getMouseRelativeToCanvas(mouse) {
    const canvas = HtmlRenderer_1.HTMLInterface.getQuerySelector('canvas');
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
    const canvas = HtmlRenderer_1.HTMLInterface.getQuerySelector('canvas');
    canvas.addEventListener('click', (event) => {
        if (isPlaying && tomato.canBeHit) {
            const mouseCoords = getMouseRelativeToCanvas(event);
            const tomatoCoords = tomato.getCoords();
            if (isOverlapping(mouseCoords, tomatoCoords)) {
                const { velX, velY } = tomato.getVelocity();
                const score = ((1 + Math.abs(velX)) * (1 + Math.abs(velY))) * 10;
                player.hit(score);
                tomato.takeHit();
                SoundManager_1.SoundManager.play(constants_1.HIT_SOUND);
            }
            else {
                player.resetCombo();
                tomato.stop();
                isPlaying = false;
                player.setBestScore();
                HtmlRenderer_1.HTMLInterface.update('b-score', String(Math.max(player.score, player.bestScore)));
                document.getElementById('play-btn').disabled = false;
                SoundManager_1.SoundManager.play(constants_1.FAIL_SOUND);
            }
        }
    });
}
function getContext() {
    const canvas = HtmlRenderer_1.HTMLInterface.getQuerySelector('canvas');
    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("context not available");
    }
    return context;
}
function gameLoop(context, time) {
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
        if (delta >= Monitor_1.FPSMonitor.MaxFPSInterval) {
            context.fillRect(0, 0, 800, 600);
            tomato.move(delta);
            tomato.draw(context);
            lastTime = time;
        }
    }
    window.requestAnimationFrame((time) => gameLoop(context, time));
}

},{"./HtmlRenderer":1,"./Monitor":2,"./Player":3,"./SoundManager":4,"./Tomato":5,"./constants":7}]},{},[8]);
