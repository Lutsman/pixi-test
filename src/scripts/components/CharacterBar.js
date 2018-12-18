import {BaseClass} from "./BaseClass";
import {Container, Text, TextStyle} from './aliases';

export class CharacterBar extends BaseClass {
    constructor(options) {
        super(options);
        this.name = options.name || '';
        this.healthPoints = options.healthPoints || null;
        this.messageName = null;
        this.textStyleOptions = options.style || {};

        this.init();
    }

    init() {
        this.renderMessageName();
    }

    renderMessageName() {
        const style = new TextStyle(this.textStyleOptions);
        const message = new Text(this.name, style);

        this.container.appendChild(message);
        this.messageName = message;
    }

    setName(name, styleOptions) {
        if (!this.messageName) return;

        this.messageName.text = name;

        if (!styleOptions) return;

        this.messageName.style = new TextStyle(styleOptions);
    }

    setHp(hp = 0) {
        this.healthPoints = hp;
    }

    setChar(options) {
        const {name, style, healthPoints} = options;

        this.setName(name, style);
        this.setHp(healthPoints);
    }

    resetCharBar() {
        this.setName('');
        this.setHp(null);
    }
}
