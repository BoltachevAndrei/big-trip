import {EVENT_TYPE_TO_ICON, EVENT_TYPE_TO_PLACEHOLDER} from "../const";
import {formatTime, formatDay, formatHour, formatMinute} from '../utils/common.js';
import AbstractComponent from "./abstract-component";

const OFFERS_SHOW_LIMIT = 2;

const formatDuration = (duration) => {
  if (duration < 0) {
    return `Внимание! Дата окончания события меньше даты начала события!`;
  }
  const durationDays = formatDay(duration) > 0 ? `${formatDay(duration)}D` : ``;
  const durationHours = formatHour(duration) > 0 || formatDay(duration) > 0 ? `${formatHour(duration)}H` : ``;
  const durationMinutes = formatHour(duration) > 0 || formatDay(duration) > 0 || formatMinute(duration) > 0 ? `${formatMinute(duration)}M` : ``;
  return `${durationDays} ${durationHours} ${durationMinutes}`;
};

const createOffersTemplate = (event) => (
  event.offers.slice(0, OFFERS_SHOW_LIMIT).map((element) => (
    `<li class="event__offer">
      <span class="event__offer-title">${element.title}</span>
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
      <h3 class="event__title">${event.type} ${EVENT_TYPE_TO_PLACEHOLDER[event.type]} ${event.destination.name}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${event.startDate}">${formatTime(event.startDate)}</time>
          —
          <time class="event__end-time" datetime="${event.endDate}">${formatTime(event.endDate)}</time>
        </p>
        <p class="event__duration">${formatDuration(event.endDate - event.startDate)}</p>
      </div>

      <p class="event__price">
        €&nbsp;<span class="event__price-value">${event.price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOffersTemplate(event)}
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
