import {isFutureDate, isPastDate} from '../utils/common.js';
import {FilterType} from '../const.js';

export const getFuturePoints = (points) => points.filter((element) => isFutureDate(element.endDate));

export const getPastPoints = (points) => points.filter((element) => isPastDate(element.endDate));

export const getPointsByFilter = (points, filterType) => {
  switch (filterType) {
    case FilterType.PAST:
      return getPastPoints(points);
    case FilterType.FUTURE:
      return getFuturePoints(points);
  }
  return points;
};
