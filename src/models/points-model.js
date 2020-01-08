import {getEventsByFilter} from '../utils/filters.js';
import {FilterType} from '../const.js';

export default class PointsModel {
  constructor() {
    this._events = [];
    this._offers = [];
    this._activeFilterType = FilterType.EVERYTHING;
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  addEvent(event) {
    this._events = [].concat(event, this._events);
    this._callHandlers(this._dataChangeHandlers);
  }

  getEventsWithActiveFilter() {
    return getEventsByFilter(this._events, this._activeFilterType);
  }

  getEventsAll() {
    return this._events;
  }

  getFilter() {
    return this._activeFilterType;
  }

  getOffers() {
    return this._offers;
  }

  removeEvent(id) {
    const index = this._events.findIndex((element) => element.id === id);
    if (index === -1) {
      return false;
    }
    this._events = [].concat(this._events.slice(0, index), this._events.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setEvents(events) {
    this._events = Array.from(events);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setOffers(offers) {
    this._offers = offers;
  }

  updateEvent(id, event) {
    const index = this._events.findIndex((element) => element.id === id);
    if (index === -1) {
      return false;
    }
    this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  _callHandlers(handlers) {
    handlers.forEach((element) => element());
  }
}
