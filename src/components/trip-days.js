import {formatDate} from '../utils/common.js';
import AbstractComponent from "./abstract-component";

const createTripDaysTemplate = (element, index) => (
  `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${index + 1}</span>
      <time class="day__date" datetime="${element[0].startDate}">${formatDate(element[0].startDate)}</time>
    </div>

    <ul class="trip-events__list">
    </ul>
  </li>`
);

export default class TripDays extends AbstractComponent {
  constructor(group, day) {
    super();
    this._group = group;
    this._day = day;
  }

  getTemplate() {
    return createTripDaysTemplate(this._group, this._day);
  }
}
