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