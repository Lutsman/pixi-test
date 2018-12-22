import {BaseClass} from './BaseClass';
import {Text, TextStyle, Graphics} from '../utils/aliases';
import {parseColor, parseColorInObject} from '../utils/utilities';

export class Button extends BaseClass{
    constructor(options) {
        super(options);
        this.text = options.text;
        this.isDisabled = options.disable;
        this.callbackFunc = options.onClick;
        this.textStyleOptions = parseColorInObject(options.style);
        this.backgroundColor = parseColor(options.backgroundColor || '#2e4cff');
        this.borderColor = parseColor(options.borderColor || '#ff4810');

        this.init();
    }

    init() {
        this.renderButton();
        this.attachHandlers();
    }

    renderButton() {
        const container = this.container;
        const style = new TextStyle(this.textStyleOptions);
        const message = new Text(this.text, style);
        const rectangle = new Graphics();

        rectangle.lineStyle(1, this.borderColor, 1);
        rectangle.beginFill(this.backgroundColor);
        rectangle.drawRect(0, 0, this.width || message.width * 1.2, this.height || message.height * 1.2);
        rectangle.endFill();

        message.position.set(
            rectangle.width / 2 - message.width / 2,
            rectangle.height / 2 - message.height / 2,
        );

        container.addChild(rectangle);
        container.addChild(message);

        if (this.isDisabled) {
            this.disable();
        } else {
            this.enable();
        }
    }

    attachHandlers() {
        this.container.on('click', this.clickHandler);
    }

    clickHandler = e => {
        if (this.isDisabled) return;

        this.callbackFunc(e);
    };

    disable() {
        const container = this.container;

        container.alpha = 0.5;
        container.interactive = false;
        container.buttonMode = false;

        this.isDisabled = true;
    }

    enable() {
        const container = this.container;

        container.alpha = 1;
        container.interactive = true;
        container.buttonMode = true;

        this.isDisabled = false;
    }

    toggleDisable() {
        if (this.isDisabled) {
            this.enable();
        } else {
            this.disable();
        }
    }
}