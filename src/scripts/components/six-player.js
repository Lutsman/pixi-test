import * as PIXI from 'pixi.js';
import 'pixi-spine';

const app = new PIXI.Application();
document.body.appendChild(app.view);

// load spine data
PIXI.loader
    .add('goblins', 'assets/chars/goblins/goblins.json')
    .add('boy', 'assets/chars//spineboy/spineboy.json')
    .add('dragon', 'assets/chars/dragon/dragon.json')
    .add('pixie', 'assets/chars/pixie/Pixie.json')
    .load(onAssetsLoaded);

app.stage.interactive = true;
app.stage.buttonMode = true;
// app.screen.width = document.documentElement.clientWidth;
// app.screen.height = document.documentElement.clientHeight;

function onAssetsLoaded(loader, res)
{
    const goblin = new PIXI.spine.Spine(res.goblins.spineData);
    const boy = new PIXI.spine.Spine(res.boy.spineData);
    const dragon = new PIXI.spine.Spine(res.dragon.spineData);
    const pixie = new PIXI.spine.Spine(res.pixie.spineData);

    // set current skin
    goblin.skeleton.setSkinByName('goblin');
    goblin.skeleton.setSlotsToSetupPose();

    // set the position
    goblin.x = 400;
    goblin.y = 600;

    goblin.scale.set(0.5);

    // play animation
    goblin.state.setAnimation(0, 'walk', true);

    app.stage.addChild(goblin);

    app.stage.on('pointertap', function() {
        // change current skin
        const currentSkinName = goblin.skeleton.skin.name;
        const newSkinName = (currentSkinName === 'goblin' ? 'goblingirl' : 'goblin');
        goblin.skeleton.setSkinByName(newSkinName);
        goblin.skeleton.setSlotsToSetupPose();
    });
}