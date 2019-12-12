import {createElement} from '../utils.js';

const createTripCardsBoardTemplate = () => (
  `<ul class="trip-days">
  </ul>`
);

export default class Board {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripCardsBoardTemplate();
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
