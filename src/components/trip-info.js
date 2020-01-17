import {formatDate, formatDay} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

const createTripInfoTemplate = (points) => {
  const startDate = formatDate(points[0].startDate);
  const endDate = points[0].startDate.getMonth() === points[points.length - 1].endDate.getMonth() ? formatDay(points[points.length - 1].endDate) : formatDate(points[points.length - 1].endDate);
  const offersPrice = points.map((element) => element.offers.map((offer) => offer.price)).reduce((a, b) => a.concat(b)).reduce((a, b) => Number.parseInt(a, 10) + Number.parseInt(b, 10), 0);
  const basePrice = points.map((element) => element.basePrice).reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  const tripPrice = basePrice + offersPrice;
  const tripPriceContainer = document.querySelector(`.trip-info__cost-value`);
  tripPriceContainer.innerHTML = tripPrice;
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${points[0].destination.name} — ... — ${points[points.length - 1].destination.name}</h1>
      <p class="trip-info__dates">${startDate}&nbsp;—&nbsp;${endDate}</p>
    </div>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }
}
