import {getRandomElement, getRandomArray, generateRandomNumber, generatePhotos, generateRandomStartDate, generateRandomEndDate} from "../utils";
import {OFFERS} from '../const.js';

const TYPES = [
  `Check`,
  `Sightseeing`,
  `Restaurant`,
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`
];

const DESTINATIONS = [
  `Amsterdam`,
  `Geneva`,
  `Chamonix`
];

const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const OFFERS_COUNT = {
  min: 0,
  max: 2
};

const EVENT_PRICE = {
  min: 1,
  max: 100
};

const PHOTOS_COUNT = {
  min: 0,
  max: 5
};

export const generateEvent = () => {
  const type = getRandomElement(TYPES);
  const destination = getRandomElement(DESTINATIONS);
  const description = getRandomArray(DESCRIPTIONS, 3);
  const offers = getRandomArray(OFFERS, generateRandomNumber(OFFERS_COUNT.min, OFFERS_COUNT.max));
  const price = generateRandomNumber(EVENT_PRICE.min, EVENT_PRICE.max);
  const startDate = generateRandomStartDate(new Date());
  const endDate = generateRandomEndDate(new Date(startDate));
  const photos = generatePhotos(PHOTOS_COUNT.min, PHOTOS_COUNT.max);

  return {
    type,
    destination,
    description,
    offers,
    price,
    startDate,
    endDate,
    photos
  };
};

export const generateEvents = (count) => {
  const events = new Array(count);
  for (let i = 0; i < count; i++) {
    events[i] = generateEvent();
  }
  return events;
};
