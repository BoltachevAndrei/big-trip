import {EVENT_TYPE_TO_ICON, EVENT_TYPE_TO_PLACEHOLDER} from "../const";
import {formatTime, formatDay, formatHour, formatMinute} from '../utils/common.js';
import AbstractComponent from "./abstract-component";

const formatDuration = (startDate, endDate) => {
  if (endDate - startDate < 0) {
    return `Внимание! Дата окончания события меньше даты начала события!`;
  }
  const durationDays = formatDay(endDate - startDate) > 0 ? `${formatDay(endDate - startDate)}D` : ``;
  const durationHours = formatHour(endDate - startDate) > 0 ? `${formatHour(endDate - startDate)}H` : ``;
  const durationMinutes = formatMinute(endDate - startDate) > 0 ? `${formatMinute(endDate - startDate)}M` : ``;
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
      <h3 class="event__title">${event.type} ${EVENT_TYPE_TO_PLACEHOLDER[event.type]} ${event.destination}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${event.startDate}">${formatTime(event.startDate)}</time>
          —
          <time class="event__end-time" datetime="${event.endDate}">${formatTime(event.endDate)}</time>
        </p>
        <p class="event__duration">${formatDuration(event.startDate, event.endDate)}</p>
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
