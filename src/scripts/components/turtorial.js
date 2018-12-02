import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
});

document.body.appendChild(app.view);