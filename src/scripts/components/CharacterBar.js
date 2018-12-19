import {BaseClass} from './BaseClass';
import {Graphics, Text, TextStyle} from './aliases';
import {parseColor, parseColorInObject, isNumeric} from './utilities';

export class CharacterBar extends BaseClass {
    constructor(options) {
        super(options);
        this.currentCharOptions = {
            id: options.id,
            name: options.name,
            hp: options.hp
        };
        this.messageName = null;
        this.textStyleOptions = parseColorInObject(options.style);
        this.backgroundColor = parseColor(options.backgroundColor || '#2e4cff');
        this.borderColor = parseColor(options.borderColor || '#ff4810');

        this.isFilled = false;

        this.init();
    }

    init() {
        this.checkFilled();
        this.renderMessageName();
    }

    renderMessageName() {
        const container = this.container;
        const {name} = this.currentCharOptions;
        const style = new TextStyle(this.textStyleOptions);
        const rectangle = new Graphics();
        const message = new Text(name, style);

        rectangle.lineStyle(1, this.borderColor, 1);
        rectangle.beginFill(this.backgroundColor);
        rectangle.drawRect(0, 0, this.width || message.width * 1.2, this.height || message.height * 1.2);
        rectangle.endFill();

        container.addChild(rectangle);
        container.addChild(message);
        this.messageName = message;
    }

    setName(name) {
        this.messageName.text = name;
        this.currentCharOptions = {
            ...this.currentCharOptions,
            name,
        };
    }

    setHp(hp) {
        this.currentCharOptions = {
            ...this.currentCharOptions,
            hp,
        };
    }

    setStyle(style) {
        if (!style) return;

        this.textStyleOptions = parseColorInObject(style);
        this.messageName.style = new TextStyle(this.textStyleOptions);
    }

    setChar(options) {
        const {name, hp, id, style} = options;

        if (!id || !name || !isNumeric(hp)) return;

        this.currentCharOptions = {
            id,
        };

        this.setName(name);
        this.setHp(hp);
        this.setStyle(style);
        this.checkFilled();
    }

    getChar() {
        return this.currentCharOptions;
    }

    reset() {
        this.setName('');
        this.setHp(null);
        this.currentCharOptions = {};
        this.checkFilled();
    }

    checkFilled() {
        const {name, id, hp} = this.currentCharOptions;
        let isFilled = true;

        if (!name) {
            isFilled = false;
        }

        if (!id) {
            isFilled = false;
        }

        if (!isNumeric(hp)) {
            isFilled = false;
        }

        return this.isFilled = isFilled;
    }
}
