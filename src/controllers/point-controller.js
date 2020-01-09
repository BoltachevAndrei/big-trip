import AddEditEvent from '../components/add-edit-event.js';
import Event from '../components/event.js';
import {remove, render, replace, RenderPosition} from '../utils/render.js';
import {EVENT_TYPE_TO_PLACEHOLDER, DESTINATION_TO_DESCRIPTION} from '../const.js';

export const Mode = {
  ADD: `add`,
  EDIT: `edit`,
  VIEW: `view`
};

const getFirstKey = (object) => Object.keys(object)[0];

const getFirstValue = (object) => Object.values(object)[0];

export const EmptyEvent = {
  type: getFirstKey(EVENT_TYPE_TO_PLACEHOLDER),
  destination: {
    name: getFirstKey(DESTINATION_TO_DESCRIPTION),
    description: getFirstValue(DESTINATION_TO_DESCRIPTION),
    pictures: []
  },
  offers: [],
  price: ``,
  startDate: null,
  endDate: null,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, offers) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._offers = offers;

    this._mode = Mode.VIEW;

    this._eventComponent = null;
    this._addEditEventComponent = null;

    this._onEscKeydown = this._onEscKeydown.bind(this);
  }

  render(event, mode) {
    const oldEventComponent = this._eventComponent;
    const oldAddEditEventComponent = this._addEditEventComponent;
    this._mode = mode;

    this._eventComponent = new Event(event);
    this._addEditEventComponent = new AddEditEvent(event, this._offers);

    this._eventComponent.setRollupButtonClickHandler(() => {
      this._replaceEventToAddEdit();
      document.addEventListener(`keydown`, this._onEscKeydown);
    });

    this._addEditEventComponent.setFavoriteButtonClickHandler(() => this._onDataChange(this, event, Object.assign({}, event, {isFavorite: !event.isFavorite})));

    this._addEditEventComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._addEditEventComponent.getFormData();
      this._onDataChange(this, event, data);
    });

    this._addEditEventComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, event, null));

    switch (mode) {
      case Mode.VIEW:
        if (oldEventComponent && oldAddEditEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._addEditEventComponent, oldAddEditEventComponent);
          this._replaceAddEditToEvent();
        } else {
          render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADD:
        if (oldEventComponent && oldAddEditEventComponent) {
          remove(oldEventComponent);
          remove(oldAddEditEventComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeydown);
        render(this._container, this._addEditEventComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.VIEW) {
      this._replaceAddEditToEvent();
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._addEditEventComponent);
    document.removeEventListener(`keydown`, this._onEscKeydown);
  }

  _replaceAddEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeydown);
    this._addEditEventComponent.reset();
    replace(this._eventComponent, this._addEditEventComponent);
    this._mode = Mode.VIEW;
  }

  _replaceEventToAddEdit() {
    this._onViewChange();
    replace(this._addEditEventComponent, this._eventComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeydown(evt) {
    const isEscKeydown = evt.key === `Esc` || evt.key === `Escape`;
    if (isEscKeydown) {
      if (this._mode === Mode.ADD) {
        this._onDataChange(this, EmptyEvent, null);
      }
      this._replaceAddEditToEvent();
    }
  }
}
