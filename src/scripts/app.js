import {Application, loader} from './utils/aliases';
import {CHARACTER_SOURCE} from './utils/characterSource';
import {creatRandomCharacters} from './utils/characterCreator';
import {HelloScene} from './components/HelloScene';
import {stateExecutor} from './utils/gameState';

const width = document.documentElement.clientWidth;
const height = document.documentElement.clientHeight;
const app = new Application({
    width,
    height,
});

document.body.appendChild(app.view);

const gameloop = stateExecutor;

const onAssetsLoaded = (loader, res) => {
    const charOptions = {};
    const team1 = creatRandomCharacters(res, 3, charOptions);
    const team2 = creatRandomCharacters(res, 3, charOptions);

    const helloSceneController = new HelloScene({
        width,
        height,
        team1,
        team2,
    });

    app.stage.addChild(helloSceneController.container);

    app.ticker.add(delta => gameloop(delta));
};

loader
    .add(CHARACTER_SOURCE.goblin.type, CHARACTER_SOURCE.goblin.link)
    .add(CHARACTER_SOURCE.boy.type, CHARACTER_SOURCE.boy.link)
    .add(CHARACTER_SOURCE.dragon.type, CHARACTER_SOURCE.dragon.link)
    .add(CHARACTER_SOURCE.pixie.type, CHARACTER_SOURCE.pixie.link)
    .load(onAssetsLoaded);
