import {isFutureDate, isPastDate} from '../utils/common.js';
import {FilterType} from '../const.js';

export const getFutureEvents = (events) => events.filter((element) => isFutureDate(element.endDate));

export const getPastEvents = (events) => events.filter((element) => isPastDate(element.endDate));

export const getEventsByFilter = (events, filterType) => {
  switch (filterType) {
    case FilterType.PAST:
      return getPastEvents(events);
    case FilterType.FUTURE:
      return getFutureEvents(events);
  }
  return events;
};
