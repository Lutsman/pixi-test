import {BaseClass} from './BaseClass';
import {CharacterBar} from './CharacterBar';
import {Button} from './Button';
import {MatrixWalker} from '../utils/matrixWalker';
import {setState, removeState} from "../utils/gameState";
import {setScale} from '../utils/characterCreator';
import {getRandomInt, getUniqueId, execState} from '../utils/utilities';

export class HelloScene extends BaseClass {
    constructor(options) {
        super(options);
        this.team1 = options.team1;
        this.team2 = options.team2;
        this.allCharacters = [...this.team1, ...this.team2];
        this.characterData = new Map();
        this.state = null;
        this.containOptions = {};
        this.charOptions = {};
        this.id = getUniqueId();
        this.state = new Map();

        this.characterBarTeam1 = null;
        this.characterBarTeam2 = null;
        this.toolBar = null;
        this.charBarOptions = { //TODO hardcoded, manage this
            width: 200,
            height: 50,
        };

        this.init();
    }

    init() {
        this.renderScene();
        this.containOptions = this.getContainOptions();
        this.charOptions.team1 = this.getCharacterOptions(this.team1, this.containOptions.team1);
        this.charOptions.team2 = this.getCharacterOptions(this.team2, this.containOptions.team2, -1);
        this.setupCharacters(this.team1, this.charOptions.team1);
        this.setupCharacters(this.team2, this.charOptions.team2);
        this.setEntetiesPosition();
        this.setCharacterPosition(this.team1, this.charOptions.team1, this.containOptions.team1);
        this.setCharacterPosition(this.team2, this.charOptions.team2, this.containOptions.team2);
        this.setCharacterLocalData(this.team1, {team: 'team1'});
        this.setCharacterLocalData(this.team2, {team: 'team2'});
        this.creatWalkers(this.team1, this.containOptions.team1);
        this.creatWalkers(this.team2, this.containOptions.team2);
        this.attachHandlers();
        this.addTicker();
    }

    getContainOptions() { // TODO make more beautifull
        const {width, height} = this;
        const headerHeight = this.getHeaderHeight();
        const width5 = width * 0.05;
        const width35 = width * 0.35;
        const width60 = width * 0.60;
        const team1 = {
            x: width5,
            y: headerHeight,
            width: width35,
            height: height - headerHeight,
        };
        const team2 = {
            x: width60,
            y: headerHeight,
            width: width35,
            height: height - headerHeight,
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

    getHeaderHeight() {
        return Math.max(
            this.characterBarTeam1.container.height,
            this.characterBarTeam2.container.height,
        );
    }

    setupCharacters(characters, options) {
        for (const character of characters) {
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

        team1CharacterBar.x = team1.x + team1.width / 2 - team1CharacterBar.width / 2;
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

    setCharacterLocalData(characters, optionalFields = {}) {
        const charData = this.characterData;
        const characterArr = Array.isArray(characters) ? characters : [characters];

        for (const character of characterArr) {
            const id = character.customHelpers.id;
            const data = charData.get(id) || {};
            const position = {
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
                    data.position :
                    {
                        base: position,
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

    toggleCharBar(charBar, options) {
        const {id} = charBar.getChar();

        if (id === options.id) {
            charBar.reset();
        } else {
            charBar.setChar(options);
        }
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
            width: 200,
            height: 50,
        });
    }

    renderToolBar() {
        return new Button({
            text: 'Shake hands',
            disable: true,
            onClick: this.clickToolBarHandler,
        });
    }

    creatWalkers(team, container) {
        for (const character of team) {
            const obstacles = team.reduce((arr, currCharacter) => {
                if (character.customHelpers.id !== currCharacter.customHelpers.id) {
                    arr.push(currCharacter);
                }

                return arr;
            }, []);
            const walker = new MatrixWalker({
                character,
                state: this.state,
                container,
                obstacles,
            });

            this.setCharacterLocalData(character, {walker});
        }
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

    clickCharacterHandler = e => {
        const character = e.target;
        const data = this.getCharacterData(character.customHelpers.id);
        const charOptions = {
            id: character.customHelpers.id,
            name: character.customHelpers.name,
            hp: 100, // TODO hp and mana generation
            maxHp: 100,
            mana: 100,
            maxMana: 100,
        };

        if (data.team === 'team1') {
            this.toggleCharBar(this.characterBarTeam1, charOptions);
        } else {
            this.toggleCharBar(this.characterBarTeam2, charOptions);
        }

        if (this.characterBarTeam1.isFilled && this.characterBarTeam2.isFilled) {
            this.toolBar.enable();
        } else {
            this.toolBar.disable();
        }
    };

    clickToolBarHandler = e => {
        const char1 = this.characterBarTeam1.getChar();
        const char2 = this.characterBarTeam2.getChar();
        const walker1 = this.getCharacterData(char1.id).walker;
        const walker2 = this.getCharacterData(char2.id).walker;
        const {x, y, width} = this.getCenterZone();
        const middle1 = {
            x,
            y,
        };
        const middle2 = {
            x: x + width / 2,
            y,
        };

        Promise.all([
            walker1.go(middle1),
            walker2.go(middle2),
        ]).then(() => {
            setTimeout(() => {
                walker1
                    .goBack()
                    .then(() => walker1.turnRight());
                walker2
                    .goBack()
                    .then(() => walker2.turnLeft());
            }, 2000);
        });
    };

    addTicker() {
        setState(this.id, execState(this.state));
    }

    removeTicker() {
        removeState(this.id);
    }

    getCenterZone() {
        const {allCharacters, width, height} = this;
        const maxCharWidth = Math.max(...allCharacters.map(char => char.width));
        const maxCharHeight = Math.max(...allCharacters.map(char => char.height));
        const headerHeight = this.getHeaderHeight();

        return {
            x: width / 2 - maxCharWidth,
            y: (height - headerHeight) / 2 - maxCharHeight / 2 + headerHeight,
            width: maxCharWidth * 4,
            height: maxCharHeight,
        };
    }
}
