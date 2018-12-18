import {setupCharacter, setScale} from './characterCreator';
import {contain, getRandomInt} from './utilities';
import {BaseClass} from "./BaseClass";

export class HelloScene extends BaseClass {
    constructor(options) {
        super(options);
        this.team1 = options.team1;
        this.team2 = options.team2;
        this.allCharacters = this.team1.concat(this.team2);
        this.charactersData = new Map();
        this.containOptions = {};
        this.charOptions = {};

        this.init();
    }

    init() {
        this.renderScene();
        this.containOptions = this.getContainOptions(this.width, this.height);
        this.charOptions.team1 = this.getCharacterOptions(this.team1, this.containOptions.team1);
        this.charOptions.team2 = this.getCharacterOptions(this.team2, this.containOptions.team2, -1);
        this.setupCharacters(this.team1, this.charOptions.team1);
        this.setupCharacters(this.team2, this.charOptions.team2);
        this.setCharacterPosition(this.team1, this.charOptions.team1, this.containOptions.team1);
        this.setCharacterPosition(this.team2, this.charOptions.team2, this.containOptions.team2);
        this.setCharacterData(this.team1, {team: 'team1'});
        this.setCharacterData(this.team1, {team: 'team2'});
        this.attachHandlers();
    }

    getContainOptions(width, height) {
        const width5 = width * 0.05;
        const width35 = width * 0.35;
        const width60 = width * 0.60;
        const team1 = {
            x: width5,
            y: 0,
            width: width35,
            height: height,
        };
        const team2 = {
            x: width60,
            y: 0,
            width: width35,
            height: height,
        };

        return {team1, team2};
    }

    getCharacterOptions(characters, containOptions, reverse = 1) {
        const options = {
            maxHeight: null,
            maxWidth: null,
            maxOffset: null,
            step: null,
            reverse,
        };

        options.maxHeight = Math.floor(containOptions.height / 6);
        options.step = Math.floor(containOptions.width / characters.length);
        options.maxWidth = Math.floor(options.step / 3);
        options.maxOffset = options.step - options.maxWidth;

        return options;
    }

    setupCharacters(characters, options) {
        for (const character of characters) {
            setupCharacter(character, options);
            setScale(character, options);
        }
    }

    setCharacterPosition(characters, characterOptions, containOptions) {
        for (let i = 0; i < characters.length; i++) {
            const {step, maxOffset, reverse} = characterOptions;
            const character = characters[i];
            const startX = containOptions.x;
            const startY = containOptions.y + character.height;
            const endY = containOptions.y + containOptions.height;

            character.x = startX + (i * step + getRandomInt(maxOffset));
            character.y = getRandomInt(endY, startY);
            character.scale.x *= reverse;
        }
    }

    setCharacterData(characters, optionalFields = {}) {
        const charData = this.charactersData;
        const characterArr = Array.isArray(characters) ? characters : [characters];

        for (const character of characterArr) {
            const id = character.customHelpers.id;
            const data = charData.get(id) || {};
            const currPosition = {
                base: {
                    x: character.x,
                    y: character.y,
                    width: character.width,
                    height: character.height,
                },
            };

            charData.set(id, {
                ...data,
                position: data.position ?
                    {
                        ...data.position,
                        curr: currPosition,
                    } :
                    {
                        base: currPosition,
                        curr: currPosition,
                    },
                speed: data.speed ? data.speed : 1,
                ...optionalFields,
            });
        }


        return charData;
    }

    renderScene() {
        const container = this.container;

        // container.interactive = true;
        // container.buttonMode = true;

        // container.on('click', e => {
        //     const target = e.target;
        //     console.dir(e);
        //     console.dir(target);
        // });

        // console.dir(helloSceneController.container);

        for (const character of this.allCharacters) {
            container.addChild(character);
        }
    }

    renderCharBar() {
        // const container = new Container();

        return container;
    }

    renderToolBar() {
        // const container = new Container();

        return container;
    }

    attachHandlers() {
        // this.container.on('click', this.clickHandler);

        for (const character of this.allCharacters) {
            character.interactive = true;
            character.buttonMode = true;
            character.on('click', this.clickHandler);
        }
    }

    detachHandlers() {
        this.container.stage.off('pointerdown', this.clickHandler);
    }

    clickHandler = e => {
        console.dir(e.target.charType);
        console.dir(e.target.position);
    };


}
