import {TYPE_TO_ICON, TYPE_TO_PLACEHOLDER} from "../const";
import {capitalizeString, formatTime, getDurationDays, getDurationHours, getDurationMinutes} from '../utils/common.js';
import AbstractComponent from "./abstract-component";

const OFFERS_SHOW_LIMIT = 2;

const formatDuration = (duration) => {
  if (duration < 0) {
    return `Внимание! Дата окончания события меньше даты начала события!`;
  }
  const durationDays = getDurationDays(duration) > 0 ? `${getDurationDays(duration)}D` : ``;
  const durationHours = getDurationHours(duration) > 0 || getDurationDays(duration) > 0 ? `${getDurationHours(duration)}H` : ``;
  const durationMinutes = getDurationHours(duration) > 0 || getDurationDays(duration) > 0 || getDurationMinutes(duration) > 0 ? `${getDurationMinutes(duration)}M` : ``;
  return `${durationDays} ${durationHours} ${durationMinutes}`;
};

const createOffersTemplate = (point) => (
  point.offers.slice(0, OFFERS_SHOW_LIMIT).map((element) => (
    `<li class="event__offer">
      <span class="event__offer-title">${element.title}</span>
        +
      €&nbsp;<span class="event__offer-price">${element.price}</span>
    </li>`)
  )
  .join(`\n`)
);

const createPointTemplate = (point) => (
  `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="${TYPE_TO_ICON[point.type]}" alt="Event type icon">
      </div>
      <h3 class="event__title">${capitalizeString(point.type)} ${TYPE_TO_PLACEHOLDER[point.type]} ${point.destination.name}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${point.startDate}">${formatTime(point.startDate)}</time>
          —
          <time class="event__end-time" datetime="${point.endDate}">${formatTime(point.endDate)}</time>
        </p>
        <p class="event__duration">${formatDuration(point.endDate - point.startDate)}</p>
      </div>

      <p class="event__price">
        €&nbsp;<span class="event__price-value">${point.basePrice}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOffersTemplate(point)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
);

export default class Point extends AbstractComponent {
  constructor(point) {
    super();
    this._point = point;
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  setRollupButtonClickHandler(handler) {
    const pointRollupButton = this.getElement().querySelector(`.event__rollup-btn`);
    pointRollupButton.addEventListener(`click`, handler);
  }
}
