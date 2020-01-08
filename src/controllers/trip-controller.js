import {render, RenderPosition} from '../utils/render.js';

import Board from '../components/board.js';
import NoEvents from '../components/no-events.js';
import TripDays from '../components/trip-days';
import TripInfo from '../components/trip-info.js';
import TripSort, {SortType} from '../components/trip-sort.js';
import PointController, {Mode as PointsControllerMode, EmptyEvent} from './point-controller.js';

const renderEvents = (eventsContainer, events, sortType, onDataChange, onViewChange, offers) => {
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
      const pointController = new PointController(newDay.getElement().querySelector(`.trip-events__list`), onDataChange, onViewChange, offers);
      pointController.render(element, PointsControllerMode.VIEW);
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
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._tripInfoComponent = null;

    this._showedPointControllers = [];
    this._noEventsComponent = new NoEvents();
    this._tripSortComponent = new TripSort();
    this._boardComponent = new Board();
    this._creatingEvent = null;

    this._sortType = SortType.DEFAULT;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._tripSortComponent.setSortTypeClickHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const events = this._pointsModel.getEventsWithActiveFilter();
    const offers = this._pointsModel.getOffers();
    const isNoEvents = events.length <= 0;
    if (isNoEvents) {
      render(this._container, isNoEvents, RenderPosition.BEFOREEND);
      return;
    }

    const tripInfoContainer = document.querySelector(`.trip-info`);

    if (this._tripInfoComponent) {
      this._tripInfoComponent.removeElement();
      tripInfoContainer.querySelector(`.trip-info__main`).remove();
    }
    this._tripInfoComponent = new TripInfo(sortEventsByDate(events));
    render(tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this._container, this._tripSortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._boardComponent, RenderPosition.BEFOREEND);
    this._renderEvents(events, offers);
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    this.render();
    const tripDaysContainer = document.querySelector(`.trip-days`);
    this._creatingEvent = new PointController(tripDaysContainer, this._onDataChange, this._onViewChange, this._pointsModel.getOffers());
    this._creatingEvent.render(EmptyEvent, PointsControllerMode.ADD);
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyEvent) {
      this._creatingEvent = null;
      if (newData === null) {
        pointController.destroy();
        this._updateEvents();
      } else {
        this._pointsModel.addEvent(newData);
        pointController.render(newData, PointsControllerMode.VIEW);
        const destroyedEvent = this._showedPointControllers.pop();
        destroyedEvent.destroy();
        this._showedPointControllers = [].concat(pointController, this._showedPointControllers);
      }
    } else if (newData === null) {
      this._pointsModel.removeEvent(oldData.id);
      this._updateEvents();
    } else {
      const isUpdateEventSuccessfull = this._pointsModel.updateEvent(oldData.id, newData);
      if (isUpdateEventSuccessfull) {
        pointController.render(newData, PointsControllerMode.VIEW);
      }
    }
    this.render();
  }

  _onFilterChange() {
    this._updateEvents();
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = [];
    const events = this._pointsModel.getEventsWithActiveFilter();
    const offers = this._pointsModel.getOffers();
    switch (sortType) {
      case SortType.DEFAULT:
        sortedEvents = events.slice();
        this._sortType = SortType.DEFAULT;
        break;
      case SortType.DURATION:
        sortedEvents = events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
        this._sortType = SortType.DURATION;
        break;
      case SortType.PRICE:
        sortedEvents = events.slice().sort((a, b) => b.price - a.price);
        this._sortType = SortType.PRICE;
        break;
    }

    this._removeEvents();
    this._renderEvents(sortedEvents, offers);
  }

  _onViewChange() {
    this._removeCreatingEvent();
    this._showedPointControllers.forEach((element) => element.setDefaultView());
  }

  _removeEvents() {
    this._showedPointControllers.forEach((element) => element.destroy());
    this._showedPointControllers = [];
  }

  _removeCreatingEvent() {
    if (this._creatingEvent) {
      this._creatingEvent.destroy();
      this._creatingEvent = null;
    }
  }

  _renderEvents(events, offers) {
    const tripDaysContainer = document.querySelector(`.trip-days`);
    const newEvents = renderEvents(tripDaysContainer, events, this._sortType, this._onDataChange, this._onViewChange, offers);
    this._showedPointControllers = this._showedPointControllers.concat(newEvents);
  }

  _updateEvents() {
    this._removeEvents();
    this._renderEvents(this._pointsModel.getEventsWithActiveFilter(), this._pointsModel.getOffers());
  }
}
