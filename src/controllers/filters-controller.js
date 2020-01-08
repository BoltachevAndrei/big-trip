import Filters from '../components/filters.js';
import {FilterType} from '../const.js';
import {render, replace, RenderPosition} from '../utils/render.js';

export default class FiltersController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._activeFilterType = FilterType.EVERYTHING;
    this._filtersComponent = null;
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const oldFiltersComponent = this._filtersComponent;
    this._filtersComponent = new Filters(this._activeFilterType);
    this._filtersComponent.setFilterChangeHandler(this._onFilterChange);
    if (oldFiltersComponent) {
      replace(oldFiltersComponent, this._filtersComponent);
    } else {
      render(container, this._filtersComponent, RenderPosition.AFTER);
    }
  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
