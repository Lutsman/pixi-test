import {getRandomItemFromObj, getUniqueId} from "./utilities";
import {CHARACTER_SOURCE} from "./characterSource";
import {Spine} from "./aliases";

export const setupGoblin = character => {
    // set current skin
    character.skeleton.setSkinByName('goblin');
    character.skeleton.setSlotsToSetupPose();

    // play animation
    character.customHelpers.go = () => {
        character.state.setAnimation(0, 'walk', true);
        character.customHelpers.isAnimating = true;
    };
    character.customHelpers.stop = () => {
        character.state.setEmptyAnimation(0, 1);
        character.customHelpers.isAnimating = false;
    };
    console.log('goblin');
    console.dir(character);

    return character;
};

export const setupBoy = character => {
    // set up the mixes!
    character.stateData.setMix('walk', 'jump', 0.2);
    character.stateData.setMix('jump', 'walk', 0.4);

    character.customHelpers.go = () => {
        character.state.setAnimation(0, 'walk', true);
        character.customHelpers.isAnimating = true;
    };
    character.customHelpers.stop = () => {
        character.state.setEmptyAnimation(0, 1);
        character.customHelpers.isAnimating = false;
    };
    console.log('boy');
    console.dir(character);

    return character;
};

export const setupPixie = character => {
    character.stateData.setMix('running', 'jump', 0.2);
    character.stateData.setMix('jump', 'running', 0.4);

    character.customHelpers.go = () => {
        character.state.setAnimation(0, 'running', true);
        character.customHelpers.isAnimating = true;
    };
    character.customHelpers.stop = () => {
        character.state.setEmptyAnimation(0, 1);
        character.customHelpers.isAnimating = false;
    };

    console.log('pixie');
    console.dir(character);

    return character;
};

export const setupDragon = character => {
    character.skeleton.setToSetupPose();
    // character.update(0);
    // character.autoUpdate = false;

    character.customHelpers.go = () => {
        character.state.setAnimation(0, 'flying', true);
        character.customHelpers.isAnimating = true;
    };
    character.customHelpers.stop = () => {
        character.state.setEmptyAnimation(0, 1);
        character.customHelpers.isAnimating = false;
    };

    console.log('dragon');
    console.dir(character);

    return character;
};

export const setScale = (character, options) => {
    const {width, height} = character.getLocalBounds();
    const {maxWidth = 0, maxHeight = 0} = options;

    if (!width || !height) return character;

    const scale = Math.min(
        maxWidth / width,
        maxHeight / height
    );

    character.scale.set(scale);

    return character;
};

export const setupCharacter = (character, options) => {
    let setuper;

    switch (character.charType) {
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

    if (setuper && character.customHelpers === undefined) {
        character.customHelpers = {
            isAnimating: false,
            id: getUniqueId(),
        };
    }

    return setuper ? setuper(character, options) : character;
};

export const creatRandomCharacters = (res, limit = 1, options) => {
    let characterSet = [];

    for (let i = 0; i < limit; i++) {
        const charType = getRandomItemFromObj(CHARACTER_SOURCE).name;
        let character = new Spine(res[charType].spineData);
        character.charType = charType;
        characterSet.push(character);
    }

    return characterSet;
};
