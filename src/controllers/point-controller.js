import AddEditEvent from '../components/add-edit-event.js';
import Event from '../components/event.js';
import {render, replace, RenderPosition} from '../utils/render.js';

const Mode = {
  VIEW: `view`,
  EDIT: `edit`
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.VIEW;

    this._eventComponent = null;
    this._addEditEventComponent = null;

    this._onEscKeydown = this._onEscKeydown.bind(this);
  }

  render(event) {
    const oldEventComponent = this._eventComponent;
    const oldAddEditEventComponent = this._addEditEventComponent;

    this._eventComponent = new Event(event);
    this._addEditEventComponent = new AddEditEvent(event);

    this._eventComponent.setRollupButtonClickHandler(() => {
      this._replaceEventToAddEdit();
      document.addEventListener(`keydown`, this._onEscKeydown);
    });

    this._addEditEventComponent.setFavoriteButtonClickHandler(() => this._onDataChange(this, event, Object.assign({}, event, {isFavorite: !event.isFavorite})));

    this._addEditEventComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceAddEditToEvent();
    });

    if (oldEventComponent && oldAddEditEventComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._addEditEventComponent, oldAddEditEventComponent);
    } else {
      render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.VIEW) {
      this._replaceAddEditToEvent();
    }
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
      this._replaceAddEditToEvent();
    }
  }
}
