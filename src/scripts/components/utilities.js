import {CHARACTER_SOURCE} from "./characterSource";

export const objectToArray = obj => {
    let arr = [];

    for (const [key, value] of Object.entries(obj)) {
        arr.push(value);
    }

    return arr;
};

export const getRandomInt = (max, min = 0) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomLetter = () =>
    String.fromCharCode(getRandomInt(122, 65));

export const getRandomId = (letterCount = 3, numbersCount = 5) => {
    let id = '';

    while (letterCount--) {
        id += getRandomLetter();
    }

    while (numbersCount--) {
        id += getRandomInt(9);
    }

    return id;
};

const ID_HASH = new Map();

export const getUniqueId = (letterCount = 3, numbersCount = 5, maxCycles = 1e6) => {
    while (maxCycles--) {
        const id = getRandomId(letterCount, numbersCount);

        if (ID_HASH.has(id)) continue;

        ID_HASH.set(id, new Date());
        return id;
    }

    return null;
};

/**
 * Converts a string color to a hex color number.
 *
 * @function string2hex
 * @param {string} The string color.
 * @return {hex} hex - Number in hex
 */

export const string2hex = string => {
    let str = string.slice(1);
    let result = '0x' + str;

    if (str.length === 3) {
        result = '0x';
        for (const char of str) {
            result += char + char;
        }
    }

    result = +result;

    return result;
};

export const isNumeric = n => {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

export const parseColor = color => {
  if (typeof color !== 'string' || color[0] !== '#') {
      return color;
  }

  return string2hex(color);
};

export const parseColorInObject = (obj = {}) => {
    const newObj = {};

    for (const {key, value} of Object.entries(obj)) {
        newObj[key] = parseColor(value);
    }

    return newObj;
};

export const getRandomItemFromObj = obj => {
    const arr = objectToArray(obj);
    const randomIndex = getRandomInt(arr.length - 1);

    return arr[randomIndex];
};

export const contain = (sprite, container) => {

    let collision = undefined;

    //Left
    if (sprite.x < container.x) {
        sprite.x = container.x;
        collision = "left";
    }

    //Top
    if (sprite.y < container.y) {
        sprite.y = container.y;
        collision = "top";
    }

    //Right
    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right";
    }

    //Bottom
    if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision = "bottom";
    }

    //Return the `collision` value
    return collision;
};

export function hasCollision(r1, r2, buffer = 0) {

    //Define the variables we'll need to calculate
    let hit = false;
    const r1Res = {};
    const r2Res = {};

    //Find the center points of each sprite
    r1Res.centerX = r1.x + r1.width / 2;
    r1Res.centerY = r1.y + r1.height / 2;
    r2Res.centerX = r2.x + r2.width / 2;
    r2Res.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1Res.halfWidth = r1.width / 2;
    r1Res.halfHeight = r1.height / 2;
    r2Res.halfWidth = r2.width / 2;
    r2Res.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    const vx = r1Res.centerX - r2Res.centerX;
    const vy = r1Res.centerY - r2Res.centerY;

    //Figure out the combined half-widths and half-heights
    const combinedHalfWidths = r1Res.halfWidth + r2Res.halfWidth;
    const combinedHalfHeights = r1Res.halfHeight + r2Res.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths + buffer) {

        //A collision might be occurring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights + buffer) {

            //There's definitely a collision happening
            hit = true;
        } else {

            //There's no collision on the y axis
            hit = false;
        }
    } else {

        //There's no collision on the x axis
        hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
};

export const moveObserver = (tower, partisans, extraTowerRange) => {
    let catchedPartisans = [];

    for (const partisan of partisans) {
        if (hasCollision(tower, partisan, extraTowerRange)) {
            catchedPartisans.push(partisan);
        }
    }

    return catchedPartisans;
};

export const moveTo = (destX, destY, character, container, containerChildren, options) => {

};
