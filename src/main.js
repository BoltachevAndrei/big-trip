import {generateEvents} from './mock/events.js';

import {render, RenderPosition} from './utils.js';

import AddEditEvent from './components/add-edit-event.js';
import Board from './components/board.js';
import Event from './components/event.js';
import Filters from './components/filters.js';
import Menu from './components/menu.js';
import NoEvents from './components/no-events.js';
import TripDays from './components/trip-days.js';
import TripInfo from './components/trip-info.js';
import TripSort from './components/trip-sort.js';

const TRIP_EVENTS_COUNT = 10;

const renderEvent = (event, container) => {
  const newEvent = new Event(event);
  const newAddEditEvent = new AddEditEvent(event);

  const onEscKeydown = (evt) => {
    const isEscKeydown = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKeydown) {
      replaceEditEventToEventView();
      document.removeEventListener(`keydown`, onEscKeydown);
    }
  };

  const replaceEditEventToEventView = () => container.replaceChild(newEvent.getElement(), newAddEditEvent.getElement());

  const replaceEventViewToEditEvent = () => container.replaceChild(newAddEditEvent.getElement(), newEvent.getElement());

  const eventRollupButton = newEvent.getElement().querySelector(`.event__rollup-btn`);
  eventRollupButton.addEventListener(`click`, () => {
    replaceEventViewToEditEvent();
    document.addEventListener(`keydown`, onEscKeydown);
  });

  const addEditEventForm = newAddEditEvent.getElement();
  addEditEventForm.addEventListener(`submit`, replaceEditEventToEventView);

  render(container, newEvent.getElement(), RenderPosition.BEFOREEND);
};

const groupEventsByDate = (events) => {
  const sortedEvents = events.slice().sort((a, b) => a.startDate - b.startDate);
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

const tripEvents = generateEvents(TRIP_EVENTS_COUNT);
const isNoEvents = tripEvents.length > 0 ? false : true;

const menuContainer = document.querySelector(`.trip-controls h2:nth-of-type(1)`);
render(menuContainer, new Menu().getElement(), RenderPosition.AFTER);

const filtersContainer = document.querySelector(`.trip-controls h2:nth-of-type(2)`);
render(filtersContainer, new Filters().getElement(), RenderPosition.AFTER);

const tripEventsContainer = document.querySelector(`.trip-events`);

if (isNoEvents) {
  render(tripEventsContainer, new NoEvents().getElement(), RenderPosition.AFTERBEGIN);
} else {
  const renderTripDay = (group, day) => {
    const newDay = new TripDays(group, day);
    render(tripDaysContainer, newDay.getElement(), RenderPosition.BEFOREEND);
    return newDay;
  };

  const sortedEvents = sortEventsByDate(tripEvents);
  const groupedEvents = groupEventsByDate(sortedEvents);

  const tripInfoContainer = document.querySelector(`.trip-info`);
  render(tripInfoContainer, new TripInfo(sortedEvents).getElement(), RenderPosition.AFTERBEGIN);

  render(tripEventsContainer, new TripSort().getElement(), RenderPosition.BEFOREEND);
  render(tripEventsContainer, new Board().getElement(), RenderPosition.BEFOREEND);

  const tripDaysContainer = document.querySelector(`.trip-days`);
  groupedEvents.forEach((group, day) => {
    const newDay = renderTripDay(group, day);
    group.forEach((element) => renderEvent(element, newDay.getElement().querySelector(`.trip-events__list`)));
  });
}
