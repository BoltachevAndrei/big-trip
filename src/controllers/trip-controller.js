import {render, replace, RenderPosition} from '../utils/render.js';

import AddEditEvent from '../components/add-edit-event.js';
import Board from '../components/board.js';
import Event from '../components/event.js';
import NoEvents from '../components/no-events.js';
import TripDays from '../components/trip-days';
import TripInfo from '../components/trip-info.js';
import TripSort, {SortType} from '../components/trip-sort.js';

const renderEvent = (event, container) => {
  const newEvent = new Event(event);
  const newAddEditEvent = new AddEditEvent(event);
  const replaceEditEventToEventView = () => replace(newEvent, newAddEditEvent);
  const replaceEventViewToEditEvent = () => replace(newAddEditEvent, newEvent);

  const onEscKeydown = (evt) => {
    const isEscKeydown = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKeydown) {
      replaceEditEventToEventView();
      document.removeEventListener(`keydown`, onEscKeydown);
    }
  };

  newEvent.setRollupButtonClickHandler(() => {
    replaceEventViewToEditEvent();
    document.addEventListener(`keydown`, onEscKeydown);
  });
  newAddEditEvent.setFormSubmitHandler(replaceEditEventToEventView);

  render(container, newEvent, RenderPosition.BEFOREEND);
};

const renderEvents = (events, container, sortType) => {
  container.innerHTML = ``;
  const renderTripDay = (group, day) => {
    const newDay = new TripDays(group, day);
    render(container, newDay, RenderPosition.BEFOREEND);
    return newDay;
  };

  if (sortType !== SortType.DEFAULT) {
    const groupedEvents = events.slice();
    const newDay = renderTripDay(groupedEvents, 0);
    groupedEvents.forEach((element) => {
      renderEvent(element, newDay.getElement().querySelector(`.trip-events__list`));
    });
  } else {
    const sortedEvents = sortEventsByDate(events);
    const groupedEvents = groupEventsByDate(sortedEvents);
    groupedEvents.forEach((group, day) => {
      const newDay = renderTripDay(group, day);
      group.forEach((element) => renderEvent(element, newDay.getElement().querySelector(`.trip-events__list`)));
    });
  }
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
    this._noEvents = new NoEvents();
    this._tripSort = new TripSort();
    this._board = new Board();
  }

  render(events) {
    const isNoEvents = events.length <= 0;
    if (isNoEvents) {
      render(this._container, this._noEvents, RenderPosition.AFTERBEGIN);
    } else {
      const tripInfoContainer = document.querySelector(`.trip-info`);
      render(tripInfoContainer, new TripInfo(events), RenderPosition.AFTERBEGIN);
      render(this._container, this._tripSort, RenderPosition.BEFOREEND);
      render(this._container, this._board, RenderPosition.BEFOREEND);
      const tripDaysContainer = document.querySelector(`.trip-days`);

      this._tripSort.setSortTypeClickHandler((sortType) => {
        let sortedEvents = [];
        switch (sortType) {
          case SortType.DEFAULT:
            sortedEvents = events.slice();
            renderEvents(sortedEvents, tripDaysContainer, sortType);
            break;
          case SortType.DURATION:
            sortedEvents = events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
            renderEvents(sortedEvents, tripDaysContainer, sortType);
            break;
          case SortType.PRICE:
            sortedEvents = events.slice().sort((a, b) => b.price - a.price);
            renderEvents(sortedEvents, tripDaysContainer, sortType);
            break;
        }
      });
      renderEvents(events, tripDaysContainer, SortType.DEFAULT);
    }
  }
}
