import AddEditPoint from '../components/add-edit-point.js';
import Point from '../components/point.js';
import PointModel from '../models/point-model.js';
import {remove, render, replace, RenderPosition} from '../utils/render.js';
import {TYPE_TO_PLACEHOLDER} from '../const.js';

export const Mode = {
  ADD: `add`,
  EDIT: `edit`,
  VIEW: `view`
};

const getType = (rawType) => {
  const keys = Object.keys(TYPE_TO_PLACEHOLDER);
  const index = keys.findIndex((element) => rawType.toLowerCase().startsWith(element));
  const type = keys[index];
  return type;
};

const parseFormData = (formData, generatedOffers) => {
  const type = getType(document.querySelector(`.event__type-output`).innerText);
  const offerNamePrefix = `event-offer-`;
  const offersForType = generatedOffers.filter((element) => element.type === type)[0].offers;
  const offers = offersForType.filter((element) => formData.get(`${offerNamePrefix}${element.title}`) === `on`);
  return new PointModel({
    'base_price': Number.parseInt(formData.get(`event-price`), 10),
    'date_from': new Date(formData.get(`event-start-time`)),
    'date_to': new Date(formData.get(`event-end-time`)),
    'destination': {
      name: formData.get(`event-destination`),
      description: document.querySelector(`.event__destination-description`).innerText,
      pictures: []
    },
    'id': String(new Date() + Math.random()),
    'is_favorite': formData.get(`event-favorite`),
    'offers': offers,
    'type': type
  });
};

const getFirstKey = (object) => Object.keys(object)[0];

export const EmptyPoint = {
  type: getFirstKey(TYPE_TO_PLACEHOLDER),
  startDate: null,
  endDate: null,
  destination: {
    pictures: []
  },
  price: ``,
  isFavorite: false,
  offers: []
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, offers, destinations) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._offers = offers;
    this._destinations = destinations;

    this._mode = Mode.VIEW;

    this._pointComponent = null;
    this._addEditPointComponent = null;

    this._onEscKeydown = this._onEscKeydown.bind(this);
  }

  render(point, mode) {
    const oldPointComponent = this._pointComponent;
    const oldAddEditPointComponent = this._addEditPointComponent;
    this._mode = mode;

    this._pointComponent = new Point(point);
    this._addEditPointComponent = new AddEditPoint(point, this._offers, this._destinations);

    this._pointComponent.setRollupButtonClickHandler(() => {
      this._replacePointToAddEdit();
      document.addEventListener(`keydown`, this._onEscKeydown);
    });

    this._addEditPointComponent.setFavoriteButtonClickHandler(() => {
      const newPoint = PointModel.clone(point);
      newPoint.isFavorite = !newPoint.isFavorite;
      this._onDataChange(this, point, newPoint);
    });

    this._addEditPointComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._addEditPointComponent.getFormData();
      const data = parseFormData(formData, this._offers);
      this._onDataChange(this, point, data);
    });

    this._addEditPointComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, point, null));

    switch (mode) {
      case Mode.VIEW:
        if (oldPointComponent && oldAddEditPointComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._addEditPointComponent, oldAddEditPointComponent);
          this._replaceAddEditToPoint();
        } else {
          render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADD:
        if (oldPointComponent && oldAddEditPointComponent) {
          remove(oldPointComponent);
          remove(oldAddEditPointComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeydown);
        render(this._container, this._addEditPointComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.VIEW) {
      this._replaceAddEditToPoint();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._addEditPointComponent);
    document.removeEventListener(`keydown`, this._onEscKeydown);
  }

  _replaceAddEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeydown);
    this._addEditPointComponent.reset();
    if (document.contains(this._addEditPointComponent.getElement())) {
      replace(this._pointComponent, this._addEditPointComponent);
    }
    this._mode = Mode.VIEW;
  }

  _replacePointToAddEdit() {
    this._onViewChange();
    replace(this._addEditPointComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeydown(evt) {
    const isEscKeydown = evt.key === `Esc` || evt.key === `Escape`;
    if (isEscKeydown) {
      if (this._mode === Mode.ADD) {
        this._onDataChange(this, EmptyPoint, null);
      }
      this._replaceAddEditToPoint();
    }
  }
}
