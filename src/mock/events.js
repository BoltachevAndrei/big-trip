import {DESTINATION_TO_DESCRIPTION, OFFERS} from '../const.js';

const TYPES = [
  `Check-in`,
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
  `Chamonix`,
  `Saint Petersburg`
];

const OFFERS_COUNT = {
  min: 0,
  max: 5
};

const EVENT_PRICE = {
  min: 1,
  max: 100
};

const PHOTOS_COUNT = {
  min: 0,
  max: 5
};

const generateRandomNumber = (min, max) => (min + Math.round(Math.random() * (max - min)));

const getRandomElement = (array) => array[generateRandomNumber(0, [array.length - 1])];

const generateRandomBoolean = () => Math.random() > 0.5;

const getRandomArray = (array, size = array.length) => array.slice().filter(() => generateRandomBoolean()).slice(0, generateRandomNumber(1, size));

const generatePhotos = (minSize, maxSize) => {
  const length = generateRandomNumber(minSize, maxSize);
  const result = new Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = `http://picsum.photos/300/150?r=${Math.random()}`;
  }
  return result;
};

const generateRandomEndDate = (targetDate) => {
  const newMinutes = generateRandomNumber(0, (60 * 48));
  targetDate.setMinutes(newMinutes);
  return targetDate;
};

const generateRandomStartDate = (targetDate) => {
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * generateRandomNumber(0, 7);
  const newHours = generateRandomNumber(0, 23);
  const newMinutes = generateRandomNumber(0, 59);
  targetDate.setDate(targetDate.getDate() + diffValue);
  targetDate.setHours(newHours);
  targetDate.setMinutes(newMinutes);
  return targetDate;
};

const generateDestinations = () => {
  return DESTINATIONS.map((element) => {
    const description = DESTINATION_TO_DESCRIPTION[element];
    const name = element;
    const picturesSrc = generatePhotos(PHOTOS_COUNT.min, PHOTOS_COUNT.max);
    const pictures = picturesSrc.map((picture) => {
      return {
        src: picture,
        description: getRandomElement(description)
      };
    });
    return {
      description,
      name,
      pictures
    };
  });
};

export const generateOffers = () => {
  return TYPES.map((element) => {
    const type = element;
    const offers = getRandomArray(OFFERS, generateRandomNumber(OFFERS_COUNT.min, OFFERS_COUNT.max));
    return {
      type,
      offers
    };
  });
};

export const generateEvent = (generatedDestinations, allOffers) => {
  const id = String(new Date() + Math.random());
  const type = getRandomElement(TYPES);
  const destination = getRandomElement(generatedDestinations);
  const price = generateRandomNumber(EVENT_PRICE.min, EVENT_PRICE.max);
  const startDate = generateRandomStartDate(new Date());
  const endDate = generateRandomEndDate(new Date(startDate));
  const isFavorite = generateRandomBoolean();
  const index = allOffers.findIndex((element) => element.type === type);
  const offers = getRandomArray(allOffers[index].offers);

  return {
    price,
    startDate,
    endDate,
    destination,
    id,
    isFavorite,
    offers,
    type
  };
};

export const generateEvents = (count, allOffers) => {
  const destinations = generateDestinations();
  const events = new Array(count);
  for (let i = 0; i < count; i++) {
    events[i] = generateEvent(destinations, allOffers);
  }
  return events;
};
