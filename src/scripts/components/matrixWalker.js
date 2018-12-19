import {contain, hasCollision, getUniqueId} from './utilities';

export class MatrixWalker {
    constructor({
        walker,
        container,
        obstacles,
        state,
                }) {
        this.walker = walker;
        this.container = container;
        this.obstacles = obstacles;
        this.state = state;
        this.path = {};
        this.pathHistory = [];
        this.isWalking = false;
        this.id = getUniqueId();
    }

    go(x, y) {
        const pathStart = {
            curr: {
                x: this.walker.x,
                y: this.walker.y,
            },
            start: {
                x: this.walker.x,
                y: this.walker.y,
            },
            end: {
                x,
                y,
            },
            steps: [],
            described: false,
            passed: false,
        };
        const path = getPath(pathStart);

        this.moove(path);
    }

    goBack() {

    }

    getPath(path) {

    }

    moove(path) {
        const generator = null;
        this.state.set(this.id, delta => generator.next(delta));
    }

    stop() {
        this.state.delete(this.id);
    }

    getCurrPath() {

    }

    getPosition() {

    }

    getTarget() {

    }

    getPathHistory () {

    }
}
