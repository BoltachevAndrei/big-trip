export const HIDDEN_CLASS = `visually-hidden`;

export const TYPE_TO_ICON = {
  'taxi': `img/icons/taxi.png`,
  'bus': `img/icons/bus.png`,
  'train': `img/icons/train.png`,
  'ship': `img/icons/ship.png`,
  'transport': `img/icons/transport.png`,
  'drive': `img/icons/drive.png`,
  'flight': `img/icons/flight.png`,
  'check-in': `img/icons/check-in.png`,
  'sightseeing': `img/icons/sightseeing.png`,
  'restaurant': `img/icons/restaurant.png`
};

export const TYPE_TO_PLACEHOLDER = {
  'taxi': `to`,
  'bus': `to`,
  'train': `to`,
  'ship': `to`,
  'transport': `to`,
  'drive': `to`,
  'flight': `to`,
  'check-in': `in`,
  'sightseeing': `in`,
  'restaurant': `in`
};

export const DEFAULT_TYPE = `taxi`;

export const EMPTY_POINT = {
  type: DEFAULT_TYPE,
  startDate: null,
  endDate: null,
  destination: {
    name: ``,
    description: ``,
    pictures: []
  },
  price: ``,
  isFavorite: false,
  offers: []
};

export const MONTHS = [
  `Jan`,
  `Feb`,
  `Mar`,
  `Apr`,
  `May`,
  `Jun`,
  `Jul`,
  `Aug`,
  `Sept`,
  `Oct`,
  `Nov`,
  `Dec`
];

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};
