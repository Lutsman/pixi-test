import {setupCharacter, setScale} from './characterCreator';
import {getRandomInt} from './utilities';
import {BaseClass} from "./BaseClass";
import {CharacterBar} from "./CharacterBar";
import {Button} from "./Button";

export class HelloScene extends BaseClass {
    constructor(options) {
        super(options);
        this.team1 = options.team1;
        this.team2 = options.team2;
        this.allCharacters = this.team1.concat(this.team2);
        this.characterData = new Map();
        this.containOptions = {};
        this.charOptions = {};

        this.characterBarTeam1 = null;
        this.characterBarTeam2 = null;
        this.toolBar = null;

        this.init();
    }

    init() {
        this.renderScene();
        this.containOptions = this.getContainOptions(this.width, this.height);
        this.charOptions.team1 = this.getCharacterOptions(this.team1, this.containOptions.team1);
        this.charOptions.team2 = this.getCharacterOptions(this.team2, this.containOptions.team2, -1);
        this.setupCharacters(this.team1, this.charOptions.team1);
        this.setupCharacters(this.team2, this.charOptions.team2);
        this.setEntetiesPosition();
        this.setCharacterPosition(this.team1, this.charOptions.team1, this.containOptions.team1);
        this.setCharacterPosition(this.team2, this.charOptions.team2, this.containOptions.team2);
        this.setCharacterData(this.team1, {team: 'team1'});
        this.setCharacterData(this.team2, {team: 'team2'});
        this.attachHandlers();
    }

    getContainOptions(width, height) {
        const width5 = width * 0.05;
        const width35 = width * 0.35;
        const width60 = width * 0.60;
        const height5 = height * 0.05;
        const height95 = height * 0.95;
        const team1 = {
            x: width5,
            y: height5,
            width: width35,
            height: height95,
        };
        const team2 = {
            x: width60,
            y: height5,
            width: width35,
            height: height95,
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

    setEntetiesPosition() {
        const stageWidth = this.width;
        const stageHeight = this.height;
        const {team1, team2} = this.containOptions;
        const team1CharacterBar = this.characterBarTeam1.container;
        const team2CharacterBar = this.characterBarTeam2.container;
        const toolBar = this.toolBar.container;

        team1CharacterBar.x = team1.x + team1.width / 2 - team1CharacterBar.width / 2 ;
        team1CharacterBar.y = 0;

        team2CharacterBar.x = team2.x + team2.width / 2 - team2CharacterBar.width / 2;
        team2CharacterBar.y = 0;

        toolBar.x = stageWidth / 2 - toolBar.width / 2;
        toolBar.y = stageHeight - toolBar.height;
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
        const charData = this.characterData;
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

    getCharacterData(id) {
        return this.characterData.get(id);
    }

    renderScene() {
        const container = this.container;
        const characterBarTeam1 = this.characterBarTeam1 = this.renderCharBar();
        const characterBarTeam2 = this.characterBarTeam2 = this.renderCharBar();
        const toolBar = this.toolBar = this.renderToolBar();

        for (const character of this.allCharacters) {
            container.addChild(character);
        }

        container.addChild(characterBarTeam1.container);
        container.addChild(characterBarTeam2.container);
        container.addChild(toolBar.container);
    }

    renderCharBar() {
        return new CharacterBar({
            width: 100,
            height: 30,
        });
    }

    renderToolBar() {
        return new Button({
            text: 'Shake hands',
            disable: true,
            onClick: this.clickToolBarHandler,
        });
    }

    attachHandlers() {
        for (const character of this.allCharacters) {
            character.interactive = true;
            character.buttonMode = true;
            character.on('click', this.clickCharacterHandler);
        }
    }

    detachHandlers() {
        for (const character of this.allCharacters) {
            character.interactive = true;
            character.buttonMode = true;
            character.off('click', this.clickCharacterHandler);
        }
    }

    toggleBarChar(charBar, options) {
        const {id} = charBar.getChar();

        if (id === options.id) {
            charBar.reset();
        } else {
            charBar.setChar(options);
        }
    }

    clickCharacterHandler = e => {
        const character = e.target;
        const data = this.getCharacterData(character.customHelpers.id);
        const charOptions = {
            id: character.customHelpers.id,
            name: `${character.charType} ${character.customHelpers.id}`,
            hp: 100,
        };

        if (data.team === 'team1') {
            this.toggleBarChar(this.characterBarTeam1, charOptions);
        } else {
            this.toggleBarChar(this.characterBarTeam2, charOptions);
        }

        if (this.characterBarTeam1.isFilled && this.characterBarTeam2.isFilled) {
            this.toolBar.enable();
        } else {
            this.toolBar.disable();
        }
    };

    clickToolBarHandler = e => {
        console.dir(e.target);
        console.log('Shake hands!');
    };
}
