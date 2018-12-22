// TODO avoid obstacles movment

import {contain, hasCollision, getUniqueId, revertArray} from './utilities';

export class MatrixWalker {
    constructor({
        character,
        container,
        obstacles,
        state,
        speed,
                }) {
        this.character = character;
        this.container = container;
        this.obstacles = obstacles;
        this.speed = speed || 1;
        this.state = state;
        this.path = {};
        this.pathHistory = [];
        this.isWalking = false;
        this.id = getUniqueId();
        this.resolve = null;
        this.reject = null;
    }

    getPathTemplate(target) {
        return {
            start: {
                x: Math.floor(this.character.x),
                y: Math.floor(this.character.y),
            },
            end: {
                x: Math.floor(target.x),
                y: Math.floor(target.y),
            },
            width: this.character.width,
            height: this.character.height,
            steps: [],
            activeStep: 0,
            described: false,
            finish: false,
            pause: false,
            speed: this.speed,
        };
    }

    go(target) {
        const pathStart = {
            start: {
                x: Math.floor(this.character.x),
                y: Math.floor(this.character.y),
            },
            end: {
                x: Math.floor(target.x),
                y: Math.floor(target.y),
            },
            width: this.character.width,
            height: this.character.height,
            steps: [],
            activeStep: 0,
            described: false,
            finish: false,
            pause: false,
            speed: this.speed,
        };
        const path = this.getPath(pathStart);

        return this.move(path);
    }

    goBack() {
        this.stop();
        const prevPath = this.pathHistory[this.pathHistory.length - 1];

        if (!prevPath) return;

        const path = this.getPathTemplate(prevPath.start);

        path.steps = revertArray(prevPath.steps);

        return this.move(path);
    }

    turnLeft() {
        const character = this.character;

        return new Promise(resolve => {
            character.scale.x = Math.abs(character.scale.x) * -1;
            resolve();
        });
    }

    turnRight() {
        const character = this.character;

        return new Promise(resolve => {
            character.scale.x = Math.abs(character.scale.x);
            resolve();
        });
    }

    getSpeedIndex (start, end, speed) {
        return {
            x: speed * (end.x - start.x) / Math.abs(end.x - start.x),
            y: speed * (end.y - start.y) / Math.abs(end.y - start.y),
        };
    }

    getShortPath(start, end, speedIndex, limit = 1e4) {
        const curr = {...start};
        let steps = [];

        while ((curr.x !== end.x || curr.y !== end.y) && limit--) {
            curr.x = curr.x === end.x ? curr.x : curr.x + speedIndex.x;
            curr.y = curr.y === end.y ? curr.y : curr.y + speedIndex.y;

            steps.push({
                x: curr.x,
                y: curr.y,
            });
        }

        return steps;
    }

    getPath(path) {
        const {start, end, speed} = path;
        const speedIndex = this.getSpeedIndex(start, end, speed);
        const steps = this.getShortPath(start, end, speedIndex);

        return {
            ...path,
            steps,
            // described: true,
        };
    }

    ticker = delta => {
        const {steps, activeStep, finish, pause} = this.path;
        const nextStep = activeStep + 1;
        const character = this.character;

        if (finish || steps.length <= nextStep) {
            this.path.finish = true;
            this.stop();
            return;
        }

        if (pause) return;

        if (steps[activeStep].x < steps[nextStep].x) {
            character.scale.x = Math.abs(character.scale.x);
        } else if (steps[activeStep].x > steps[nextStep].x) {
            character.scale.x = Math.abs(character.scale.x) * -1;
        }

        character.x = steps[nextStep].x;
        character.y = steps[nextStep].y;

        this.path.activeStep = nextStep;
    };

    addTicker() {
        this.state.set(this.id, this.ticker);
        this.character.customHelpers.go();
        this.isWalking = true;
    }

    removeTicker() {
        this.state.delete(this.id);
        this.character.customHelpers.stop();
        this.isWalking = false;
    }

    move(path) {
        this.path = path;
        this.addTicker();

        return new Promise( resolve => this.resolve = resolve);
    }

    stop() {
        if (!this.isWalking) return;

        const resolve = this.resolve;

        this.removeTicker();

        if (typeof resolve === 'function') {
            resolve(this.path);
        }

        this.pathToHistory();
    }

    pause() {
        this.path.pause = true;
    }

    resume() {
        this.path.pause = false;
    }

    pathToHistory() {
        const {activeStep, steps} = this.path;

        if (!this.path || activeStep === 0) {
            this.path = null;
            return;
        }

        steps.length = activeStep + 1;

        this.pathHistory.push({
            ...this.path,
            steps,
        });
        this.path = null;
    }

    getCurrPath() {
        return this.path;
    }

    getPosition() {
        return {
            x: this.character.x,
            y: this.character.y,
            width: this.character.width,
            height: this.character.height,
        };
    }

    getTarget() {
        return this.path ? this.path.end : null;
    }

    getPathHistory () {
        return this.pathHistory;
    }
}
