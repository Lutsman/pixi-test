import {Container} from '../utils/aliases';

export class BaseClass {
    constructor(options) {
        this.width = options.width;
        this.height = options.height;
        this.container = new Container();
    }
}
