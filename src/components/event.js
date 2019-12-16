import {EVENT_TYPE_TO_ICON} from "../const";
import {addLeadingZero, formatDateToDateTime} from '../utils/common.js';
import AbstractComponent from "./abstract-component";

const formatDateToTime = (date) => `${addLeadingZero(date.getHours())}:${addLeadingZero(date.getMinutes())}`;

const formatDuration = (milliseconds) => {
  if (milliseconds < 0) {
    return `Внимание! Дата окончания события меньше даты начала события!`;
  }
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

const createEventTemplate = (event) => (
  `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="${EVENT_TYPE_TO_ICON[event.type]}" alt="Event type icon">
      </div>
      <h3 class="event__title">${event.type} ${event.destination}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatDateToDateTime(event.startDate)}">${formatDateToTime(event.startDate)}</time>
          —
          <time class="event__end-time" datetime="${formatDateToDateTime(event.endDate)}">${formatDateToTime(event.endDate)}</time>
        </p>
        <p class="event__duration">${formatDuration(event.endDate - event.startDate)}</p>
      </div>

      <p class="event__price">
        €&nbsp;<span class="event__price-value">${event.price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOffersTemplate(event.offers)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
);

export default class Event extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  setRollupButtonClickHandler(handler) {
    const eventRollupButton = this.getElement().querySelector(`.event__rollup-btn`);
    eventRollupButton.addEventListener(`click`, handler);
  }
}
