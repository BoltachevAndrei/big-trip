import AbstractComponent from './abstract-component.js';
import {FilterType} from '../const.js';

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => id.substring(FILTER_ID_PREFIX.length);

const createFiltersTemplate = (filterType) => (
  Object.values(FilterType).map((element) =>
    `<div class="trip-filters__filter">
      <input id="filter-${element}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${element}" ${element === filterType ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${element}">${element}</label>
    </div>`)
  .join(`\n`)
);

const createFiltersContainerTemplate = (filterType) => {
  const filters = createFiltersTemplate(filterType);
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filters}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters extends AbstractComponent {
  constructor(filterType) {
    super();
    this._activeFilterType = filterType;
  }

  getTemplate() {
    return createFiltersContainerTemplate(this._activeFilterType);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
