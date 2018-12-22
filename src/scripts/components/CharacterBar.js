import {BaseClass} from './BaseClass';
import {Indicator} from "./Indicator";
import {Container, Graphics, Text, TextStyle} from '../utils/aliases';
import {parseColor, parseColorInObject, isNumeric} from '../utils/utilities';

export class CharacterBar extends BaseClass {
    constructor(options) {
        super(options);
        this.id = options.id;
        this.name = options.name;
        this.hp = options.hp;
        this.maxHp = options.maxHp || options.hp;
        this.mana = options.mana;
        this.maxMana = options.maxMana || options.mana;
        this.textStyleOptions = parseColorInObject(options.style);
        this.backgroundColor = parseColor(options.backgroundColor || '#7fff5e');
        this.nameBar = null; //TODO move name bar to component
        this.hpBarController = null;
        this.manaBarController = null;

        this.isFilled = false;

        this.init();
    }

    init() {
        this.checkFilled();
        this.renderCharBar();
    }

    renderNameBar() {
        const nameBar = new Container();
        const {name} = this;
        const style = new TextStyle(this.textStyleOptions);
        const rectangle = new Graphics();
        const message = new Text(name, style);

        rectangle.beginFill(this.backgroundColor);
        rectangle.drawRect(0, 0, this.width || message.width * 1.2, this.height || message.height * 1.2);
        rectangle.endFill();

        nameBar.addChild(rectangle);
        nameBar.addChild(message);
        nameBar.message = message;

        return nameBar;
    }

    renderIndicator(options = {}) {
        return new Indicator(options);
    }

    renderCharBar() {
        const charBar = this.container;
        const nameBar = this.nameBar = this.renderNameBar();
        const hpBarController = this.hpBarController = this.renderIndicator({
            count: this.hp,
            maxCount: this.maxHp,
            width: this.width,
            height: 10,
        });
        const manaBarController = this.manaBarController = this.renderIndicator({
            count: this.mana,
            maxCount: this.maxMana,
            width: this.width,
            height: 10,
            color: '#2e4cff',
        });

        hpBarController.container.y = nameBar.height;
        manaBarController.container.y = nameBar.height + hpBarController.container.height;

        charBar.addChild(nameBar);
        charBar.addChild(hpBarController.container);
        charBar.addChild(manaBarController.container);
    }

    setName(name) {
        this.nameBar.message.text = this.name = name;
    }

    setHp(hp, maxHp) {
        const hpBar = this.hpBarController;

        hpBar.set(hp, maxHp);
        const {count, maxCount} = hpBar.get();
        this.hp = count;
        this.maxHp = maxCount;
    }

    setMaxHp(maxHp) {
        const hpBar = this.hpBarController;

        hpBar.setMaxCount(maxHp);
        this.maxHp = hpBar.getMaxCount();
    }

    setMana(mana, maxMana) {
        const manaBar = this.manaBarController;

        manaBar.set(mana, maxMana);
        const {count, maxCount} = manaBar.get();
        this.mana = count;
        this.maxMana = maxCount;
    }

    setMaxMana(maxMana) {
        const manaBar = this.manaBarController;

        manaBar.setMaxCount(maxMana);
        this.maxMana = manaBar.getMaxCount();
    }

    setStyle(style) {
        if (!style) return;

        this.textStyleOptions = parseColorInObject(style);
        this.nameBar.style = new TextStyle(this.textStyleOptions);
    }

    setChar(options) {
        const {id, name, hp, maxHp, mana, maxMana, style} = options;

        this.id = id;
        this.setName(name);
        this.setHp(hp, maxHp);
        this.setMana(mana, maxMana);
        this.setStyle(style);

        if (!this.checkFilled()) {
             this.reset();
        }
    }

    getChar() {
        const {id, name, hp, mana, textStyleOptions} = this;
        return {
            id,
            name,
            hp,
            mana,
            style: textStyleOptions,
        };
    }

    reset() {
        this.id = null;
        this.setName('');
        this.setHp(0);
        this.setMana(0);
        this.checkFilled();
    }

    checkFilled() {
        const {name, id, hp, maxHp, mana, maxMana} = this;

        if (!name) {
            return this.isFilled = false;
        }

        if (!id) {
            return this.isFilled = false;
        }

        if (!isNumeric(hp) || !isNumeric(maxHp) || maxHp < 1) {
            return this.isFilled = false;
        }

        if (!isNumeric(mana) || !isNumeric(maxMana) || maxMana < 1) {
            return this.isFilled = false;
        }

        return this.isFilled = true;
    }
}
