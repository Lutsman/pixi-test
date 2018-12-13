import {CHARACTER_SOURCE} from "./characterSource";

export const objectToArray = obj => {
  let arr = [];

  for (const [key, value] of Object.entries(obj)) {
      arr.push(value);
  }

  return arr;
};

export const randomInt = (max, min = 0) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomItemFromObj = obj => {
    const arr = objectToArray(obj);
    const randomIndex = randomInt(arr.length - 1);

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
}