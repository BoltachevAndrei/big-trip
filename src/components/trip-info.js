import {MONTHS} from '../const.js';
import {addLeadingZero, createElement} from '../utils.js';

const formatDate = (date) => (date instanceof Date) ? `${date.getDate()} ${MONTHS[date.getMonth()]}` : ``;

const createTripInfoTemplate = (events) => {
  const startDate = formatDate(events[0].startDate);
  const endDate = events[0].startDate.getMonth() === events[events.length - 1].endDate.getMonth() ? addLeadingZero(events[events.length - 1].endDate.getDate()) : formatDate(events[events.length - 1].endDate);
  const tripPrice = events.map((element) => element.price).reduce((previousValue, currentValue) => previousValue + currentValue);
  const tripPriceContainer = document.querySelector(`.trip-info__cost-value`);
  tripPriceContainer.innerHTML = tripPrice;
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${events[0].destination} — ... — ${events[events.length - 1].destination}</h1>
      <p class="trip-info__dates">${startDate}&nbsp;—&nbsp;${endDate}</p>
    </div>`
  );
};

export default class TripInfo {
  constructor(events) {
    this._element = null;
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
