import {Application, loader, Graphics} from './aliases';
import {CHARACTER_SOURCE} from './characterSource';
import {creatRandomCharacters} from './characterCreator';
import {HelloScene} from './HelloScene';


const width = document.documentElement.clientWidth;
const height = document.documentElement.clientHeight;
const app = new Application({
    width,
    height,
});

document.body.appendChild(app.view);

loader
    .add(CHARACTER_SOURCE.goblin.name, CHARACTER_SOURCE.goblin.link)
    .add(CHARACTER_SOURCE.boy.name, CHARACTER_SOURCE.boy.link)
    .add(CHARACTER_SOURCE.dragon.name, CHARACTER_SOURCE.dragon.link)
    .add(CHARACTER_SOURCE.pixie.name, CHARACTER_SOURCE.pixie.link)
    .load(onAssetsLoaded);

function onAssetsLoaded(loader, res) {
    const team1 = creatRandomCharacters(res, 3);
    const team2 = creatRandomCharacters(res, 3);

    const helloSceneController = new HelloScene({
        width,
        height,
        team1,
        team2,
    });

    app.stage.addChild(helloSceneController.container);
}
