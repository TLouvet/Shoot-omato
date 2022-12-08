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
const HtmlInterface_1 = require("./HtmlInterface");
class Player {
    constructor() {
        this._score = 0;
        this._bestScore = 0;
        this._combo = 1;
    }
    init() {
        this._score = 0;
        this._combo = 1;
        HtmlInterface_1.HTMLInterface.update('score', String(this._score));
    }
    hit(points) {
        this._score += Math.round(points * this._combo);
        this._combo++;
        HtmlInterface_1.HTMLInterface.update('score', String(this._score));
        HtmlInterface_1.HTMLInterface.update('combo', String(this._combo));
    }
    resetCombo() {
        this._combo = 1;
        HtmlInterface_1.HTMLInterface.update('combo', String(this._combo));
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

},{"./HtmlInterface":1}],4:[function(require,module,exports){
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
const CoordsComponent_1 = require("./components/CoordsComponent");
const CollisionBox_1 = require("./components/CollisionBox");
class Tomato {
    constructor(width, height) {
        this.sprite = new Image();
        this.VelocityComponent = new SpeedComponent_1.SpeedComponent();
        this.CoordsComponent = new CoordsComponent_1.CoordsComponent(width, height);
        this.CollisionBox = new CollisionBox_1.CollisionBox(this.CoordsComponent);
    }
    init() {
        this.CoordsComponent.centerOnScreen();
        this.VelocityComponent.init();
    }
    setSpriteSource(src) {
        this.sprite.src = src;
    }
    setInitialVel() {
        this.VelocityComponent.setInitialVel();
    }
    stop() {
        this.CoordsComponent.centerOnScreen();
        this.VelocityComponent.stop();
    }
    move(elapsedTime) {
        const { xPosition, yPosition } = this.getUpdatedPositionValues(elapsedTime);
        this.CoordsComponent.updateOnMove(xPosition, yPosition);
        this.handleCollisions();
    }
    getUpdatedPositionValues(elapsedTime) {
        const { x, y } = this.CoordsComponent.getBounds();
        const { velX, velY } = this.VelocityComponent.getValues();
        const xPosition = x + velX * elapsedTime;
        const yPosition = y + velY * elapsedTime;
        return { xPosition, yPosition };
    }
    takeHit() {
        this.VelocityComponent.addBonus();
        this.VelocityComponent.accelerate();
        this.CollisionBox.handleHit();
    }
    handleCollisions() {
        this.onHorizontalCollision();
        this.onVerticalCollision();
    }
    onHorizontalCollision() {
        if (!this.CollisionBox.collideXAxis()) {
            return;
        }
        const correctedX = this.CoordsComponent.x <= 0 ? 0 : constants_1.SCREEN_WIDTH - this.CoordsComponent.width;
        this.VelocityComponent.inverseVel("velX");
        this.CoordsComponent.setX(correctedX);
    }
    onVerticalCollision() {
        if (!this.CollisionBox.collideYAxis()) {
            return;
        }
        const correctedY = this.CoordsComponent.y <= 0 ? 0 : constants_1.SCREEN_HEIGHT - this.CoordsComponent.height;
        this.VelocityComponent.inverseVel("velY");
        this.CoordsComponent.setY(correctedY);
    }
    canBeHit() {
        return this.CollisionBox.canBeHit;
    }
    getBounds() {
        return this.CoordsComponent.getBounds();
    }
    getVelocity() {
        return this.VelocityComponent.getValues();
    }
    getDrawInformations() {
        return {
            sprite: this.sprite,
            x: this.CoordsComponent.x,
            y: this.CoordsComponent.y,
            width: this.CoordsComponent.width,
            height: this.CoordsComponent.height,
            canDraw: this.CollisionBox.canBeHit
        };
    }
}
exports.Tomato = Tomato;

},{"./components/CollisionBox":6,"./components/CoordsComponent":7,"./components/SpeedComponent":8,"./constants":9}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionBox = void 0;
const constants_1 = require("../constants");
// WIP
class CollisionBox {
    constructor(coords) {
        this._canBeHit = true;
        this.CoordsComponent = coords;
    }
    // isOverlapping(otherObject: Coords2D) {
    // }
    get canBeHit() {
        return this._canBeHit;
    }
    handleHit() {
        this._canBeHit = false;
        setTimeout(() => {
            this._canBeHit = true;
        }, constants_1.DEFAULT_INVINCIBLE_TIME);
    }
    collideXAxis() {
        return this.collideScreenX() || this.collideScreenW();
    }
    collideScreenX() {
        return this.CoordsComponent.x <= 0;
    }
    collideScreenW() {
        return this.CoordsComponent.x + this.CoordsComponent.width >= constants_1.SCREEN_WIDTH;
    }
    collideYAxis() {
        return this.collideScreenY() || this.collideScreenH();
    }
    collideScreenY() {
        return this.CoordsComponent.y <= 0;
    }
    collideScreenH() {
        return this.CoordsComponent.y + this.CoordsComponent.height >= constants_1.SCREEN_HEIGHT;
    }
}
exports.CollisionBox = CollisionBox;

},{"../constants":9}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoordsComponent = void 0;
const constants_1 = require("../constants");
class CoordsComponent {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.centerOnScreen();
    }
    updateOnMove(newX, newY) {
        this.x = newX;
        this.y = newY;
    }
    setX(newX) {
        this.x = newX;
    }
    setY(newY) {
        this.y = newY;
    }
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            w: this.x + this.width,
            h: this.y + this.height
        };
    }
    centerOnScreen() {
        this.x = (constants_1.SCREEN_WIDTH / 2) - (this.width / 2);
        this.y = (constants_1.SCREEN_HEIGHT / 2) - (this.height / 2);
    }
}
exports.CoordsComponent = CoordsComponent;

},{"../constants":9}],8:[function(require,module,exports){
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

},{"../constants":9}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const HtmlInterface_1 = require("./HtmlInterface");
const Monitor_1 = require("./Monitor");
const Player_1 = require("./Player");
const SoundManager_1 = require("./SoundManager");
const Tomato_1 = require("./Tomato");
const tomato = new Tomato_1.Tomato(constants_1.SPRITE_WIDTH, constants_1.SPRITE_HEIGHT);
const player = new Player_1.Player();
let isPlaying = false;
let lastTime = 0;
(_a = document.getElementById('play-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    document.getElementById('play-btn').disabled = true;
    play();
});
function main() {
    initCanvasListener();
    tomato.setSpriteSource(constants_1.TOMATO_IMAGE_URL);
    const context = getContext();
    context.fillStyle = 'black';
    gameLoop(context, 0);
}
main();
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
                SoundManager_1.SoundManager.play(constants_1.HIT_SOUND);
            }
            else {
                player.resetCombo();
                tomato.stop();
                isPlaying = false;
                player.setBestScore();
                HtmlInterface_1.HTMLInterface.update('b-score', String(Math.max(player.score, player.bestScore)));
                document.getElementById('play-btn').disabled = false;
                SoundManager_1.SoundManager.play(constants_1.FAIL_SOUND);
            }
        }
    });
}
function getCanvas() {
    return HtmlInterface_1.HTMLInterface.getQuerySelector('canvas');
}
function getContext() {
    const canvas = getCanvas();
    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("context not available");
    }
    return context;
}
function gameLoop(context, time) {
    if (lastTime != null) {
        const delta = time - lastTime;
        // This way we cap FPS to a maximum
        if (delta >= Monitor_1.FPSMonitor.MaxFPSInterval) {
            context.fillRect(0, 0, constants_1.SCREEN_WIDTH, constants_1.SCREEN_HEIGHT);
            tomato.move(delta);
            const { sprite, x, y, width, height, canDraw } = tomato.getDrawInformations();
            if (canDraw) {
                context.drawImage(sprite, x, y, width, height);
            }
            lastTime = time;
        }
    }
    window.requestAnimationFrame((time) => gameLoop(context, time));
}

},{"./HtmlInterface":1,"./Monitor":2,"./Player":3,"./SoundManager":4,"./Tomato":5,"./constants":9}]},{},[10]);
