import PIXI, {Application, loader} from './aliases';
import {CHARACTER_SOURCE} from './characterSource';
import {creatRandomCharacters} from './characterCreator';


const app = new Application({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
});
document.body.appendChild(app.view);

// load spine data
loader
    .add(CHARACTER_SOURCE.goblin.name, CHARACTER_SOURCE.goblin.link)
    .add(CHARACTER_SOURCE.boy.name, CHARACTER_SOURCE.boy.link)
    .add(CHARACTER_SOURCE.dragon.name, CHARACTER_SOURCE.dragon.link)
    .add(CHARACTER_SOURCE.pixie.name, CHARACTER_SOURCE.pixie.link)
    .load(onAssetsLoaded);

app.stage.interactive = true;
app.stage.buttonMode = true;
// app.screen.width = document.documentElement.clientWidth;
// app.screen.height = document.documentElement.clientHeight;

function onAssetsLoaded(loader, res) {
    // const goblin = new PIXI.spine.Spine(res.goblin.spineData);
    // const boy = new PIXI.spine.Spine(res.boy.spineData);
    // const dragon = new PIXI.spine.Spine(res.dragon.spineData);
    // const pixie = new PIXI.spine.Spine(res.pixie.spineData);

    const team1 = creatRandomCharacters(res, 3);
    const team2 = creatRandomCharacters(res, 3);



    // app.stage.addChild(goblin);
    //
    // app.stage.on('pointertap', function () {
    //     // change current skin
    //     const currentSkinName = goblin.skeleton.skin.name;
    //     const newSkinName = (currentSkinName === 'goblin' ? 'goblingirl' : 'goblin');
    //     goblin.skeleton.setSkinByName(newSkinName);
    //     goblin.skeleton.setSlotsToSetupPose();
    // });
}
