import {formatDate, formatDay} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

const createTripInfoTemplate = (events) => {
  const startDate = formatDate(events[0].startDate);
  const endDate = events[0].startDate.getMonth() === events[events.length - 1].endDate.getMonth() ? formatDay(events[events.length - 1].endDate) : formatDate(events[events.length - 1].endDate);
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

export default class TripInfo extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}
