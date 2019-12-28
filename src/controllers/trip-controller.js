import {render, RenderPosition} from '../utils/render.js';

import Board from '../components/board.js';
import NoEvents from '../components/no-events.js';
import TripDays from '../components/trip-days';
import TripInfo from '../components/trip-info.js';
import TripSort, {SortType} from '../components/trip-sort.js';
import PointController from './point-controller.js';

const renderEvents = (eventsContainer, events, sortType, onDataChange, onViewChange) => {
  eventsContainer.innerHTML = ``;
  let showedPointControllers = [];
  const renderTripDay = (group, day) => {
    const newDay = new TripDays(group, day);
    render(eventsContainer, newDay, RenderPosition.BEFOREEND);
    return newDay;
  };

  let groupedEvents = [];

  if (sortType !== SortType.DEFAULT) {
    groupedEvents = [events.slice()];
  } else {
    const sortedEvents = sortEventsByDate(events);
    groupedEvents = groupEventsByDate(sortedEvents);
  }

  groupedEvents.forEach((group, day) => {
    const newDay = renderTripDay(group, day);
    group.map((element) => {
      const pointController = new PointController(newDay.getElement().querySelector(`.trip-events__list`), onDataChange, onViewChange);
      pointController.render(element);
      showedPointControllers = showedPointControllers.concat(pointController);
      return pointController;
    });
  });
  return showedPointControllers;
};

const groupEventsByDate = (events) => {
  const sortedEvents = sortEventsByDate(events);
  const groupEvents = [];
  groupEvents.push(sortedEvents.filter((element) => element.startDate.getDate() === sortedEvents[0].startDate.getDate()));
  for (let i = 1; i < sortedEvents.length; i++) {
    if (sortedEvents[i].startDate.getDate() !== sortedEvents[i - 1].startDate.getDate()) {
      groupEvents.push(sortedEvents.filter((element) => element.startDate.getDate() === sortedEvents[i].startDate.getDate()));
    }
  }
  return groupEvents;
};

const sortEventsByDate = (events) => events.slice().sort((a, b) => a.startDate - b.startDate);

export default class TripController {
  constructor(container) {
    this._container = container;
    this._events = [];
    this._showedPointControllers = [];
    this._noEventsComponent = new NoEvents();
    this._tripSortComponent = new TripSort();
    this._boardComponent = new Board();

    this._sortType = SortType.DEFAULT;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._tripSortComponent.setSortTypeClickHandler(this._onSortTypeChange);
  }

  render(events) {
    this._events = events;

    const isNoEvents = this._events.length <= 0;
    if (isNoEvents) {
      render(this._container, isNoEvents, RenderPosition.BEFOREEND);
      return;
    }

    const tripInfoContainer = document.querySelector(`.trip-info`);
    render(tripInfoContainer, new TripInfo(sortEventsByDate(this._events)), RenderPosition.AFTERBEGIN);
    render(this._container, this._tripSortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._boardComponent, RenderPosition.BEFOREEND);
    const tripDaysContainer = document.querySelector(`.trip-days`);

    const newEvents = renderEvents(tripDaysContainer, this._events, this._sortType, this._onDataChange, this._onViewChange);
    this._showedPointControllers = this._showedPointControllers.concat(newEvents);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((element) => element === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));
    pointController.render(this._events[index]);
  }

  _onViewChange() {
    this._showedPointControllers.forEach((element) => element.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = [];
    switch (sortType) {
      case SortType.DEFAULT:
        sortedEvents = this._events.slice();
        this._sortType = SortType.DEFAULT;
        break;
      case SortType.DURATION:
        sortedEvents = this._events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
        this._sortType = SortType.DURATION;
        break;
      case SortType.PRICE:
        sortedEvents = this._events.slice().sort((a, b) => b.price - a.price);
        this._sortType = SortType.PRICE;
        break;
    }

    const tripDaysContainer = document.querySelector(`.trip-days`);
    const newEvents = renderEvents(tripDaysContainer, sortedEvents, this._sortType, this._onDataChange, this._onViewChange);
    this._showedPointControllers = newEvents;
  }
}
