import {EVENT_TYPE_TO_ICON, MONTHS} from "../const";
import {addLeadingZero} from '../utils.js';

const formatDateToDateTime = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}`;

const formatDateToTime = (date) => `${addLeadingZero(date.getHours())}:${addLeadingZero(date.getMinutes())}`;

const formatDuration = (milliseconds) => {
  const durationDays = Math.floor(milliseconds / (1000 * 60 * 60 * 24)) > 0 ? `${addLeadingZero(Math.floor(milliseconds / (1000 * 60 * 60 * 24)))}D` : ``;
  const durationHours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) > 0 ? `${addLeadingZero(Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))}H` : ``;
  const durationMinutes = `${addLeadingZero(Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60)))}M`;
  return `${durationDays} ${durationHours} ${durationMinutes}`;
};

const createOffersTemplate = (offers) => (
  offers.slice(0, 2).map((element) => (
    `<li class="event__offer">
      <span class="event__offer-title">${element.type} ${element.title}</span>
        +
      €&nbsp;<span class="event__offer-price">${element.price}</span>
    </li>`)
  )
  .join(`\n`)
);

const createEventTemplate = (events) => (
  events.map((element) => (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="${EVENT_TYPE_TO_ICON[element.type]}" alt="Event type icon">
        </div>
        <h3 class="event__title">${element.type} ${element.destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatDateToDateTime(element.startDate)}">${formatDateToTime(element.startDate)}</time>
            —
            <time class="event__end-time" datetime="${formatDateToDateTime(element.endDate)}">${formatDateToTime(element.endDate)}</time>
          </p>
          <p class="event__duration">${formatDuration(element.endDate - element.startDate)}</p>
        </div>

        <p class="event__price">
          €&nbsp;<span class="event__price-value">${element.price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersTemplate(element.offers)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`)
  )
  .join(`\n`)
);

export const createTripDaysTemplate = (events) => {
  const sortedEvents = events.slice().sort((a, b) => a.startDate - b.startDate);
  const groupEvents = [];
  groupEvents.push(sortedEvents.filter((element) => element.startDate.getDate() === sortedEvents[0].startDate.getDate()));
  for (let i = 1; i < sortedEvents.length; i++) {
    if (sortedEvents[i].startDate.getDate() !== sortedEvents[i - 1].startDate.getDate()) {
      groupEvents.push(sortedEvents.filter((element) => element.startDate.getDate() === sortedEvents[i].startDate.getDate()));
    }
  }

  return groupEvents.map((element, index) => (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${formatDateToDateTime(element[0].startDate)}">${MONTHS[element[0].startDate.getMonth()]} ${element[0].startDate.getDate()}</time>
      </div>

      <ul class="trip-events__list">
        ${createEventTemplate(element)}
      </ul>
    </li>`)
  )
  .join(`\n`);
};
