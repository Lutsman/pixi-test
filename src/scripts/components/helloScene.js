import {Container} from './aliases';
import {setupCharacter, setCharacterDimension} from './characterCreator';
import {contain, randomInt} from './utilities';

export class HelloScene {
    constructor(options) {
        this.team1 = options.team1;
        this.team2 = options.team2;
        this.allCharacters = this.team1.concat(this.team2);
        this.stageWidth = options.stageWidth;
        this.stageHeight = options.stageHeight;
        this.container = new Container();
        this.containOptions = {};
        this.charOptions = {};

        this.init();
    }

    init() {
        this.containOptions = this.getContainOptions(this.stageWidth, this.stageHeight);
        this.charOptions.team1 = this.getCharacterOptions(this.team1, this.containOptions.team1);
        this.charOptions.team2 = this.getCharacterOptions(this.team2, this.containOptions.team2, 1);
        this.setupCharacters(this.team1, this.charOptions.team1);
        this.setupCharacters(this.team2, this.charOptions.team2);
        this.setCharacterPosition(this.team1, this.charOptions.team1, this.containOptions.team1);
        this.setCharacterPosition(this.team2, this.charOptions.team2, this.containOptions.team2);
        this.renderScene();
    }

    getContainOptions(width, height) {
        const team1 = {
            x: 0,
            y: 0,
            width: width / 2,
            height: height,
        };
        const team2 = {
            x: width / 2,
            y: 0,
            width: width / 2,
            height: height,
        };

        return {team1, team2};
    }

    getCharacterOptions(characters, containOptions, reverse = 0) {
        const options = {
            maxHeigh: null,
            maxWidth: null,
            maxOffset: null,
            step: null,
            reverse,
        };

        options.maxHeigh = Math.floor(containOptions.height / 6);
        options.step = Math.floor(containOptions.width / characters.length);
        options.maxWidth = Math.floor(options.step / 3);
        options.maxOffset = options.step - options.maxWidth;

        return options;
    }

    setupCharacters(characters, options) {
        for(const character of characters) {
            setupCharacter(character, options);
            setCharacterDimension(character, options);
        }
    }

    setCharacterPosition(characters, characterOptions, containOptions) {
        for (let i = 0; i < characters.length; i++) {
            const {step, maxOffset} = characterOptions;
            const character = characters[i];
            const startX = containOptions.x;
            const startY = containOptions.y;
            const endY = containOptions.y + containOptions.height - character.height;

            character.x = startX + (i * step + randomInt(maxOffset));
            character.y = randomInt(endY, startY);
        }
    }

    renderScene() {
        for (const character of this.allCharacters) {
            this.container.addChild(character);
        }
    }
}
