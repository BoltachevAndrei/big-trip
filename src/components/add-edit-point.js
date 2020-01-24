import flatpickr from 'flatpickr';
import he from 'he';
import {TYPE_TO_ICON, TYPE_TO_PLACEHOLDER} from '../const.js';
import {capitalizeString} from '../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import debounce from 'lodash/debounce';

import {Mode} from '../controllers/point-controller.js';

const DEBOUNCE_TIMEOUT = 1000;

const DefaultData = {
  cancelButtonText: `Cancel`,
  deleteButtonText: `Delete`,
  saveButtonText: `Save`
};

const createPhotosTemplate = (pictures) => (
  pictures.map((element) => (
    `<img class="event__photo" src="${element.src}" alt="${element.description}">`)
  )
  .join(`\n`)
);

const createDestinationsTemplate = (destinations) => (
  destinations.map((destination) => (
    `<option value="${destination.name}"></option>`)
  )
  .join(`\n`)
);

const createOffersTemplate = (point, pointOffers, offers) => {
  const index = offers.findIndex((element) => element.type === point.type.toLowerCase());
  const offersTemplate = index < 0 ? `` : offers[index].offers.map((element) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${element.title}-1" type="checkbox" name="event-offer-${element.title}" ${pointOffers.some((pointOffer) => pointOffer.title === element.title) ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${element.title}-1">
        <span class="event__offer-title">${element.title}</span>
        +
        €&nbsp;<span class="event__offer-price">${element.price}</span>
      </label>
    </div>`)
  )
  .join(`\n`);

  return !offersTemplate ? `` : (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersTemplate}
      </div>
    </section>`);
};

const createDestinationDetailsTemplate = (description, photos) => {
  const destinationDetailsTemplate = description ? `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${photos}
      </div>
    </div>
  </section>` : ``;
  return destinationDetailsTemplate;
};

const createEventDetailsTemplate = (offersTemplate, destinationsDetailsTemplate) => {
  const offers = !offersTemplate ? `` : offersTemplate;
  const destination = !destinationsDetailsTemplate ? `` : destinationsDetailsTemplate;
  return ((offers || destination) ?
    `<section class="event__details">
      ${offers}
      ${destination}
    </section>` : ``);

};

const createFavoriteButtonTemplate = (isFavorite) => {
  const checked = isFavorite ? `checked` : ``;
  return (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${checked}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
        </svg>
      </label>`
  );
};

const createAddEditPointTemplate = (point, mode, options, offers, destinations) => {
  const {destination, currentDescription, pictures, externalData, pointOffers} = options;
  const description = he.encode(currentDescription ? currentDescription : ``);
  const photos = createPhotosTemplate(pictures);
  const offersTemplate = createOffersTemplate(point, pointOffers, offers);
  const destinationDetailsTemplate = destination ? createDestinationDetailsTemplate(description, photos) : ``;
  const isFavorite = (mode === Mode.ADD) ? `` : createFavoriteButtonTemplate(point.isFavorite);
  const deleteButtonText = (mode === Mode.ADD ? externalData.cancelButtonText : externalData.deleteButtonText);
  const saveButtonText = externalData.saveButtonText;
  const eventDetails = createEventDetailsTemplate(offersTemplate, destinationDetailsTemplate);

  const pointType = point.type ? point.type : ``;
  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${TYPE_TO_ICON[pointType.toLowerCase()]}" alt="${pointType ? `Event type icon` : ``}">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight">
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${capitalizeString(pointType)} ${pointType ? TYPE_TO_PLACEHOLDER[pointType.toLowerCase()] : ``}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination : ``}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createDestinationsTemplate(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="">
          —
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${point.basePrice ? point.basePrice : ``}" min="0" step="1">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
        <button class="event__reset-btn" type="reset">${deleteButtonText}</button>

        ${isFavorite}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
        ${eventDetails}
    </form>`
  );
};

export default class AddEditPoint extends AbstractSmartComponent {
  constructor(point, mode, offers, destinations) {
    super();
    this._point = point;

    this._mode = mode;

    this._offers = offers;
    this._destinations = destinations;

    this._pointOffers = this._point.offers;

    this._externalData = DefaultData;

    this._destination = this._point.destination.name;
    this._currentDescription = this._point.destination.description;
    this._pictures = this._point.destination.pictures;
    this._favoriteButtonHanlder = null;
    this._formSubmitHandler = null;
    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;
    this._deleteButtonClickHandler = null;

    this._activeOffers = this._point.offers;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createAddEditPointTemplate(this._point, this._mode, {destination: this._destination, currentDescription: this._currentDescription, pictures: this._pictures, externalData: this._externalData, pointOffers: this._pointOffers}, this._offers, this._destinations);
  }

  getFormData() {
    const form = this.getElement();
    return new FormData(form);
  }

  setData(data, pointOffers) {
    this._externalData = Object.assign({}, DefaultData, data);
    this._pointOffers = pointOffers;
    this.rerender();
  }

  recoveryListeners() {
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setFormSubmitHandler(this._formSubmitHandler);
    this.setFavoriteButtonClickHandler(this._favoriteButtonHanlder);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  removeElement() {
    if (this._flatpickrStartDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrStartDate = null;
    }
    if (this._flatpickrEndDate) {
      this._flatpickrEndDate.destroy();
      this._flatpickrEndDate = null;
    }
    super.removeElement();
  }

  reset() {
    const point = this._point;
    this._destination = point.destination.name;
    this._currentDescription = point.destination.description;
    this._pointOffers = point.offers;
    this.rerender();
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);
    this._deleteButtonClickHandler = handler;
  }

  setFormSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._formSubmitHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    if (this.getElement().querySelector(`.event__favorite-checkbox`)) {
      this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
      this._favoriteButtonHanlder = handler;
    }
  }

  setRollupButtonClickHandler(handler) {
    const pointRollupButton = this.getElement().querySelector(`.event__rollup-btn`);
    pointRollupButton.addEventListener(`click`, handler);
  }

  _applyFlatpickr() {
    if (this._flatpickrStartDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrStartDate = null;
    }
    if (this._flatpickrEndDate) {
      this._flatpickrEndDate.destroy();
      this._flatpickrEndDate = null;
    }

    const startDateElement = this.getElement().querySelector(`#event-start-time-1`);
    this._flatpickrStartDate = flatpickr(startDateElement, {
      altInput: true,
      allowInput: true,
      enableTime: true,
      defaultDate: this._point.startDate,
      altFormat: `d/m/y H:i`
    });

    const endDateElement = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpickrEndDate = flatpickr(endDateElement, {
      altInput: true,
      allowInput: true,
      enableTime: true,
      defaultDate: this._point.endDate,
      altFormat: `d/m/y H:i`
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName.toLowerCase() === `label`) {
        this._point.type = evt.target.innerHTML;
        this._destination = ``;
        this.rerender();
      }
    });

    element.querySelector(`.event__input--destination`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName.toLowerCase() === `input`) {
        evt.target.value = ``;
      }
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      if (evt.target.tagName.toLowerCase() === `input`) {
        this._destination = evt.target.value;
        this._currentDescription = this._destinations.filter((destination) => destination.name === evt.target.value)[0].description;
        this._pictures = this._destinations.filter((destination) => destination.name === evt.target.value)[0].pictures;
        this.rerender();
      }
    });

    const startDateElement = this.getElement().querySelector(`#event-start-time-1`);
    startDateElement.addEventListener(`change`, () => {
      const endDate = this.getElement().querySelector(`#event-end-time-1`);
      this._flatpickrEndDate = flatpickr(endDate, {
        altInput: true,
        allowInput: true,
        enableTime: true,
        defaultDate: endDate.value,
        altFormat: `d/m/y H:i`,
        minDate: startDateElement.value
      });
    });

    const endDateElement = this.getElement().querySelector(`#event-end-time-1`);
    endDateElement.addEventListener(`change`, () => {
      const startDate = this.getElement().querySelector(`#event-start-time-1`);
      this._flatpickrStartDate = flatpickr(startDate, {
        altInput: true,
        allowInput: true,
        enableTime: true,
        defaultDate: startDate.value,
        altFormat: `d/m/y H:i`,
        maxDate: endDateElement.value
      });
    });
  }
}
