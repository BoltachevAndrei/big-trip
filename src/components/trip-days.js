import {MONTHS} from "../const";
import {createElement, formatDateToDateTime} from '../utils.js';

const createTripDaysTemplate = (element, index) => (
  `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${index + 1}</span>
      <time class="day__date" datetime="${formatDateToDateTime(element[0].startDate)}">${MONTHS[element[0].startDate.getMonth()]} ${element[0].startDate.getDate()}</time>
    </div>

    <ul class="trip-events__list">
    </ul>
  </li>`
);

export default class TripDays {
  constructor(group, day) {
    this._element = null;
    this._group = group;
    this._day = day;
  }

  getTemplate() {
    return createTripDaysTemplate(this._group, this._day);
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
