import {getRandomItemFromObj} from "./utilities";
import {CHARACTER_SOURCE} from "./characterSource";
import {Spine} from "./aliases";

export const setupGoblin = character => {
    // set current skin
    character.skeleton.setSkinByName('goblin');
    character.skeleton.setSlotsToSetupPose();

    // set the position
    character.x = 400;
    character.y = 600;

    character.scale.set(0.5);

    // play animation
    character.state.setAnimation(0, 'walk', true);

    return character;
};

export const setupBoy = character => {
    return character;
};

export const setupPixie = character => {
    return character;
};

export const setupDragon = character => {
    return character;
};

export const setupCharacter = (character, options) => {
    let setuper;

    switch (character.name) {
        case CHARACTER_SOURCE.goblin.name :
            setuper = setupGoblin;
            break;
        case CHARACTER_SOURCE.boy.name :
            setuper = setupBoy;
            break;
        case CHARACTER_SOURCE.pixie.name :
            setuper = setupPixie;
            break;
        case CHARACTER_SOURCE.dragon.name :
            setuper = setupDragon;
            break;
    }

    return setuper ? setuper(character, options) : character;
};

export const creatRandomCharacters = (res, limit = 1, options) => {
    let characterSet = [];

    for (let i = 0; i < limit; i++) {
        const name = getRandomItemFromObj(CHARACTER_SOURCE).name;
        let character = new Spine(res[name].spineData);
        character.name = name;
        characterSet.push(character);
    }

    return characterSet;
};
