import {contain, hasCollision, getUniqueId, revertArray} from './utilities';

export class MatrixWalker {
    constructor({
        walker,
        container,
        obstacles,
        state,
        speed,
                }) {
        this.walker = walker;
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
            // curr: {
            //     x: this.walker.x,
            //     y: this.walker.y,
            // },
            start: {
                x: Math.floor(this.walker.x),
                y: Math.floor(this.walker.y),
            },
            end: {
                x: Math.floor(target.x),
                y: Math.floor(target.y),
            },
            width: this.walker.width,
            height: this.walker.height,
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
                x: Math.floor(this.walker.x),
                y: Math.floor(this.walker.y),
            },
            end: {
                x: Math.floor(target.x),
                y: Math.floor(target.y),
            },
            width: this.walker.width,
            height: this.walker.height,
            steps: [],
            activeStep: 0,
            described: false,
            finish: false,
            pause: false,
            speed: this.speed,
        };
        const path = this.getPath(pathStart);

        return this.moove(path);
    }

    goBack() {
        this.stop();
        const prevPath = this.pathHistory[this.pathHistory.length - 1];

        if (!prevPath) return;

        const path = this.getPathTemplate(prevPath.start);

        path.steps = revertArray(prevPath.steps);

        return this.moove(path);
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
        const walker = this.walker;

        if (finish || steps.length <= nextStep) {
            this.path.finish = true;
            this.stop();
            return;
        }

        if (pause) return;

        walker.x = steps[nextStep].x;
        walker.y = steps[nextStep].y;

        this.path.activeStep = nextStep;
    };

    addTicker() {
        this.state.set(this.id, this.ticker);
        this.isWalking = true;
    }

    removeTicker() {
        this.state.delete(this.id);
        this.isWalking = false;
    }

    moove(path) {
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
            x: this.walker.x,
            y: this.walker.y,
            width: this.walker.width,
            height: this.walker.height,
        };
    }

    getTarget() {
        return this.path ? this.path.end : null;
    }

    getPathHistory () {
        return this.pathHistory;
    }
}
