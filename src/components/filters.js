import AbstractComponent from './abstract-component.js';

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => id.substring(FILTER_ID_PREFIX.length);

const createFiltersTemplate = (filterType, pointsCountByFilter) => (
  Object.keys(pointsCountByFilter).map((element) =>
    `<div class="trip-filters__filter">
      <input id="filter-${element}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${element}" ${element === filterType ? `checked` : ``} ${pointsCountByFilter[element] > 0 ? `` : `disabled`}>
      <label class="trip-filters__filter-label" for="filter-${element}">${element}</label>
    </div>`)
  .join(`\n`)
);

const createFiltersContainerTemplate = (filterType, pointsCountByFilter) => {
  const filters = createFiltersTemplate(filterType, pointsCountByFilter);
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filters}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters extends AbstractComponent {
  constructor(filterType, pointsCountByFilter) {
    super();
    this._activeFilterType = filterType;
    this._pointsCountByFilter = pointsCountByFilter;
  }

  getTemplate() {
    return createFiltersContainerTemplate(this._activeFilterType, this._pointsCountByFilter);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
