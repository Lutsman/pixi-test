import {BaseClass} from './BaseClass';
import {Graphics} from "../utils/aliases";
import {parseColor, isNumeric} from "../utils/utilities";

export class Indicator extends BaseClass {
    constructor(options) {
        super(options);
        this.count = options.count || 0;
        this.maxCount = options.maxCount || options.count || 1;
        this.color = parseColor(options.color || '#ff1827');
        this.innerColor = parseColor(options.innerColor || '#4b4b4b');
        this.inner = new Graphics();
        this.outer = new Graphics();

        this.init();
    }

    init() {
        this.renderIndicator();
    }

    renderIndicator() {
        const {
            container,
            inner,
            outer,
            width,
            height,
            color,
            innerColor,
            count,
            maxCount,
        } = this;
        const outerWidth = count > 0 ? (width / maxCount) * count : 0;

        inner.beginFill(innerColor);
        inner.drawRect(0, 0, width, height);
        inner.endFill();


        outer.beginFill(color);
        outer.drawRect(0, 0, width, height); // rectangle should be rendered with some width
        outer.endFill();

        container.addChild(inner);
        container.addChild(outer);

        outer.width = outerWidth;
    }

    setCount(n) {
        if (!isNumeric(n)) return;

        const count = n > 0 ? n : 0;

        if (count > this.maxCount) {
            this.setMaxCount(count);
        }

        const outerWidth = (this.width / this.maxCount) * count;

        this.outer.width = outerWidth;
        this.count = count;
    }

    getCount() {
        return this.count;
    }

    setMaxCount(n) {
        if (!isNumeric(n)) return;

        this.maxCount = n;
        this.setCount(this.count);
    }

    getMaxCount() {
        return this.maxCount;
    }

    set(count, maxCount) {
        this.setMaxCount(maxCount);
        this.setCount(count);
    }

    get() {
        const {count, maxCount} = this;

        return {
            count,
            maxCount,
        };
    }
}
