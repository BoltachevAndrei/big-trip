export const generateRandomNumber = (min, max) => (min + Math.round(Math.random() * (max - min)));

export const getRandomElement = (array) => array[generateRandomNumber(0, [array.length - 1])];

export const generateRandomBoolean = () => Math.random() > 0.5;

export const getRandomArray = (array, size = array.length) => array.slice().filter(() => generateRandomBoolean()).slice(0, generateRandomNumber(1, size));

export const generatePhotos = (minSize, maxSize) => {
  const length = generateRandomNumber(minSize, maxSize);
  const result = new Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = `http://picsum.photos/300/150?r=${Math.random()}`;
  }
  return result;
};

export const generateRandomEndDate = (targetDate) => {
  const newMinutes = generateRandomNumber(0, (60 * 48));
  targetDate.setMinutes(newMinutes);
  return targetDate;
};

export const generateRandomStartDate = (targetDate) => {
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * generateRandomNumber(0, 7);
  const newHours = generateRandomNumber(0, 23);
  const newMinutes = generateRandomNumber(0, 59);
  targetDate.setDate(targetDate.getDate() + diffValue);
  targetDate.setHours(newHours);
  targetDate.setMinutes(newMinutes);
  return targetDate;
};

export const addLeadingZero = (value) => value < 10 ? `0${value}` : value;

export const formatDateToDateTime = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}`;
