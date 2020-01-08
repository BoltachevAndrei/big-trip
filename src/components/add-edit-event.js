import {DESTINATION_TO_DESCRIPTION, EVENT_TYPE_TO_ICON, EVENT_TYPE_TO_PLACEHOLDER} from '../const.js';
import AbstractSmartComponent from './abstract-smart-component.js';

const createPhotosTemplate = (event) => (
  event.destination.pictures.map((element) => (
    `<img class="event__photo" src="${element.src}" alt="Event photo">`)
  )
  .join(`\n`)
);

const createOffersTemplate = (event, offers) => {
  const index = offers.findIndex((element) => element.type === event.type);
  return offers[index].offers.map((element) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${element.title}-1" type="checkbox" name="event-offer-${element.title}" ${event.offers.some((eventOffer) => eventOffer.title === element.title) ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${element.title}-1">
        <span class="event__offer-title">${element.title}</span>
        +
        €&nbsp;<span class="event__offer-price">${element.price}</span>
      </label>
    </div>`)
  )
  .join(`\n`);
};

const createAddEditEventTemplate = (event, options, offers) => {
  const {destination, currentDescription} = options;
  const description = window.he.encode(currentDescription);
  const photos = createPhotosTemplate(event);
  const offersTemplate = createOffersTemplate(event, offers);
  const isFavorite = event.isFavorite ? `checked` : ``;
  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${EVENT_TYPE_TO_ICON[event.type]}" alt="Event type icon">
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
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked="">
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
            ${event.type} ${EVENT_TYPE_TO_PLACEHOLDER[event.type]}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
            <option value="Saint Petersburg"></option>
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
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${event.price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">

        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersTemplate}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photos}
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};

const getType = (rawType) => {
  const keys = Object.keys(EVENT_TYPE_TO_PLACEHOLDER);
  const index = keys.findIndex((element) => rawType.startsWith(element));
  const type = keys[index];
  return type;
};

const parseFormData = (formData, generatedOffers) => {
  const type = getType(document.querySelector(`.event__type-output`).innerText);
  const offerNamePrefix = `event-offer-`;
  const offersForType = generatedOffers.filter((element) => element.type === type)[0].offers;
  const offers = offersForType.filter((element) => formData.get(`${offerNamePrefix}${element.title}`) === `on`);
  return {
    price: Number.parseInt(formData.get(`event-price`), 10),
    startDate: new Date(formData.get(`event-start-time`)),
    endDate: new Date(formData.get(`event-end-time`)),
    destination: {
      name: formData.get(`event-destination`),
      description: document.querySelector(`.event__destination-description`).innerText,
      pictures: []
    },
    id: String(new Date() + Math.random()),
    isFavorite: formData.get(`event-favorite`),
    offers,
    type
  };
};

export default class AddEditEvent extends AbstractSmartComponent {
  constructor(event, offers) {
    super();
    this._event = event;

    this._offers = offers;

    this._destination = this._event.destination.name;
    this._currentDescription = this._event.destination.description;
    this._favoriteButtonHanlder = null;
    this._formSubmitHandler = null;
    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;
    this._deleteButtonClickHandler = null;

    this._activeOffers = this._event.offers;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createAddEditEventTemplate(this._event, {destination: this._destination, currentDescription: this._currentDescription}, this._offers);
  }

  getFormData() {
    const form = this.getElement();
    const formData = new FormData(form);
    return parseFormData(formData, this._offers);
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
    const event = this._event;
    this._destination = event.destination.name;
    this._currentDescription = event.destination.description;
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
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`click`, handler);
    this._favoriteButtonHanlder = handler;
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
    this._flatpickrStartDate = window.flatpickr(startDateElement, {
      altInput: true,
      allowInput: true,
      enableTime: true,
      defaultDate: this._event.startDate,
      altFormat: `d/m/y H:i`
    });

    const endDateElement = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpickrEndDate = window.flatpickr(endDateElement, {
      altInput: true,
      allowInput: true,
      enableTime: true,
      defaultDate: this._event.endDate,
      altFormat: `d/m/y H:i`
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName.toLowerCase() === `label`) {
        this._event.type = evt.target.innerHTML;
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
        this._currentDescription = DESTINATION_TO_DESCRIPTION[evt.target.value];
        this.rerender();
      }
    });
  }
}
