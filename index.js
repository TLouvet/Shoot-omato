(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLRenderer = void 0;
class HTMLRenderer {
    constructor() { }
    static update(id, content) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Error: Element with id ${id} not found`);
        }
        element.innerText = content;
    }
}
exports.HTMLRenderer = HTMLRenderer;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const constants_1 = require("./constants");
const HtmlRenderer_1 = require("./HtmlRenderer");
class Player {
    constructor() {
        this._ammo = constants_1.INITIAL_AMMO;
        this._score = 0;
        this._bestScore = 0;
    }
    init() {
        this._ammo = constants_1.INITIAL_AMMO;
        this._score = 0;
        HtmlRenderer_1.HTMLRenderer.update('score', String(this._score));
        HtmlRenderer_1.HTMLRenderer.update('ammo', String(this._ammo));
    }
    hit(points) {
        this._score += points;
        HtmlRenderer_1.HTMLRenderer.update('score', String(this._score));
    }
    shoot() {
        this._ammo -= 1;
        HtmlRenderer_1.HTMLRenderer.update('ammo', String(this._ammo));
    }
    get score() {
        return this._score;
    }
    get ammo() {
        return this._ammo;
    }
    get bestScore() {
        return this._bestScore;
    }
    canShoot() {
        return this._ammo > 0;
    }
}
exports.Player = Player;

},{"./HtmlRenderer":1,"./constants":6}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
    move() {
        this.x += this.VelocityComponent.velX;
        this.y += this.VelocityComponent.velY;
        if (this.collideX()) {
            this.x = 0;
            this.VelocityComponent.changeVel("velX");
        }
        if (this.collideW()) {
            this.x = constants_1.SCREEN_WIDTH - constants_1.SPRITE_WIDTH;
            this.VelocityComponent.changeVel("velX");
        }
        if (this.collideY()) {
            this.y = 0;
            this.VelocityComponent.changeVel("velY");
        }
        if (this.collideH()) {
            this.y = constants_1.SCREEN_HEIGHT - constants_1.SPRITE_HEIGHT;
            this.VelocityComponent.changeVel("velY");
        }
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
    increaseVelocity() {
        this.VelocityComponent.addBonus();
    }
    draw(context) {
        context.drawImage(this.sprite, this.x, this.y, constants_1.SPRITE_WIDTH, constants_1.SPRITE_HEIGHT);
    }
}
exports.Tomato = Tomato;

},{"./components/SpeedComponent":5,"./constants":6}],5:[function(require,module,exports){
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
    changeVel(vel) {
        if (this[vel] < 0) {
            this[vel] = Math.max(this.MinimumVelocity, this.MaximumVelocity);
        }
        else {
            this[vel] = Math.min(-this.MinimumVelocity, -this.MaximumVelocity);
        }
    }
    get MinimumVelocity() {
        return constants_1.MINIMUM_SPEED + this.velocityBonus;
    }
    get MaximumVelocity() {
        return Math.random() * 3 + this.velocityBonus;
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

},{"../constants":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HIT_SOUND = exports.FAIL_SOUND = exports.INITIAL_AMMO = exports.DEFAULT_VELOCITY_BONUS = exports.MINIMUM_SPEED = exports.TOMATO_IMAGE_URL = exports.SPRITE_HEIGHT = exports.SPRITE_WIDTH = exports.SCREEN_HEIGHT = exports.SCREEN_WIDTH = void 0;
exports.SCREEN_WIDTH = 800;
exports.SCREEN_HEIGHT = 600;
exports.SPRITE_WIDTH = 64;
exports.SPRITE_HEIGHT = 64;
exports.TOMATO_IMAGE_URL = './assets/tomato.png';
exports.MINIMUM_SPEED = 1;
exports.DEFAULT_VELOCITY_BONUS = 0.5;
exports.INITIAL_AMMO = 10;
exports.FAIL_SOUND = "./assets/issou-el-risitas.mp3";
exports.HIT_SOUND = "./assets/hit.mp3";

},{}],7:[function(require,module,exports){
"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const HtmlRenderer_1 = require("./HtmlRenderer");
const Player_1 = require("./Player");
const SoundManager_1 = require("./SoundManager");
const Tomato_1 = require("./Tomato");
const tomato = new Tomato_1.Tomato();
const player = new Player_1.Player();
let isPlaying = false;
(_a = document.getElementById('play-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    document.getElementById('play-btn').disabled = true;
    play();
});
main();
function main() {
    HtmlRenderer_1.HTMLRenderer.update('ammo', String(constants_1.INITIAL_AMMO));
    initCanvasListener();
    const context = getContext();
    context.fillStyle = 'black';
    gameLoop(context);
}
function isOverlapping(mouse, tomato) {
    return mouse.x >= tomato.x && mouse.x <= tomato.x + constants_1.SPRITE_WIDTH && mouse.y >= tomato.y && mouse.y <= tomato.y + constants_1.SPRITE_HEIGHT;
}
function getMouseRelativeToCanvas(mouse) {
    const canvas = getCanvas();
    const canvasBox = canvas.getBoundingClientRect();
    const mouseX = mouse.clientX - canvasBox.x;
    const mouseY = mouse.clientY - canvasBox.y;
    return { x: mouseX, y: mouseY };
}
function getCanvas() {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
        throw new Error('No Canvas tag on the page');
    }
    return canvas;
}
function play() {
    tomato.init();
    player.init();
    isPlaying = true;
}
function initCanvasListener() {
    const canvas = getCanvas();
    canvas.addEventListener('click', (event) => {
        if (player.canShoot() && isPlaying) {
            player.shoot();
            console.log(tomato);
            const mouseCoords = getMouseRelativeToCanvas(event);
            const tomatoCoords = tomato.getCoords();
            if (isOverlapping(mouseCoords, tomatoCoords)) {
                player.hit(1);
                tomato.increaseVelocity();
                SoundManager_1.SoundManager.play(constants_1.HIT_SOUND);
            }
            else {
                SoundManager_1.SoundManager.play(constants_1.FAIL_SOUND);
            }
        }
        // Must verify after -- probably should be reorganized
        if (!player.canShoot()) {
            tomato.stop();
            isPlaying = false;
            HtmlRenderer_1.HTMLRenderer.update('b-score', String(Math.max(player.score, player.bestScore)));
            document.getElementById('play-btn').disabled = false;
        }
    });
}
function getContext() {
    const canvas = getCanvas();
    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("context not available");
    }
    return context;
}
function gameLoop(context) {
    context.fillRect(0, 0, 800, 600);
    tomato.move();
    tomato.draw(context); // Not sure about this one
    window.requestAnimationFrame(() => gameLoop(context));
}

},{"./HtmlRenderer":1,"./Player":2,"./SoundManager":3,"./Tomato":4,"./constants":6}]},{},[7]);
