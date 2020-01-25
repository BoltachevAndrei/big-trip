import {render, RenderPosition} from '../utils/render.js';
import {HIDDEN_CLASS, DEFAULT_TYPE, EMPTY_POINT} from '../const.js';

import Board from '../components/board.js';
import NoPoints from '../components/no-points.js';
import TripDays from '../components/trip-days';
import TripInfo from '../components/trip-info.js';
import TripSort, {SortType} from '../components/trip-sort.js';
import PointController, {Mode as PointsControllerMode} from './point-controller.js';

const renderPoints = (pointsContainer, points, sortType, onDataChange, onViewChange, offers, destinations) => {
  pointsContainer.innerHTML = ``;
  let showedPointControllers = [];
  const renderTripDay = (group, day) => {
    const newDay = new TripDays(group, day);
    render(pointsContainer, newDay, RenderPosition.BEFOREEND);
    return newDay;
  };

  let groupedPoints = [];

  if (sortType !== SortType.DEFAULT) {
    groupedPoints = [points.slice()];
    groupedPoints.forEach((group) => {
      const newDay = renderTripDay(null, null);
      group.map((element) => {
        const pointController = new PointController(newDay.getElement().querySelector(`.trip-events__list`), onDataChange, onViewChange, offers, destinations);
        pointController.render(element, PointsControllerMode.VIEW);
        showedPointControllers = showedPointControllers.concat(pointController);
        return pointController;
      });
    });
    return showedPointControllers;
  } else {
    groupedPoints = groupPointsByDate(points);
    groupedPoints.forEach((group, day) => {
      const newDay = renderTripDay(group, day + 1);
      group.map((element) => {
        const pointController = new PointController(newDay.getElement().querySelector(`.trip-events__list`), onDataChange, onViewChange, offers, destinations);
        pointController.render(element, PointsControllerMode.VIEW);
        showedPointControllers = showedPointControllers.concat(pointController);
        return pointController;
      });
    });
    return showedPointControllers;
  }
};

const groupPointsByDate = (points) => {
  const sortedPoints = sortPointsByDate(points);
  const groupPoints = [];
  groupPoints.push(sortedPoints.filter((element) => element.startDate.getDate() === sortedPoints[0].startDate.getDate() && element.startDate.getMonth() === sortedPoints[0].startDate.getMonth()));
  for (let i = 1; i < sortedPoints.length; i++) {
    if (sortedPoints[i].startDate.getDate() !== sortedPoints[i - 1].startDate.getDate() || sortedPoints[i].startDate.getMonth() !== sortedPoints[i - 1].startDate.getMonth()) {
      groupPoints.push(sortedPoints.filter((element) => element.startDate.getDate() === sortedPoints[i].startDate.getDate() && element.startDate.getMonth() === sortedPoints[i].startDate.getMonth()));
    }
  }
  return groupPoints;
};

const sortPointsByDate = (points) => points.slice().sort((a, b) => a.startDate - b.startDate);

export default class TripController {
  constructor(container, pointsModel, api, statistics) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;
    this._statistics = statistics;

    this._tripInfoComponent = null;
    this._showedPointControllers = [];
    this._noPointsComponent = new NoPoints();
    this._tripSortComponent = new TripSort();
    this._boardComponent = new Board();
    this._creatingPoint = null;

    this._sortType = SortType.DEFAULT;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._tripSortComponent.setSortTypeClickHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    if (this._container) {
      this._container.classList.add(HIDDEN_CLASS);
    }
  }

  show() {
    if (this._container) {
      this._container.classList.remove(HIDDEN_CLASS);
    }
  }

  render() {
    const allPoints = this._pointsModel.getPointsAll();
    const points = this._pointsModel.getPointsWithActiveFilter();
    const sortedPoints = this._sortPointsBySortType(points, this._sortType);
    const offers = this._pointsModel.getOffers();
    const destinations = this._pointsModel.getDestinations();
    const isNoPoints = allPoints.length <= 0;
    if (isNoPoints) {
      render(this._container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    const tripInfoContainer = document.querySelector(`.trip-info`);

    if (this._tripInfoComponent) {
      this._tripInfoComponent.removeElement();
      tripInfoContainer.querySelector(`.trip-info__main`).remove();
    }
    this._tripInfoComponent = new TripInfo(sortPointsByDate(allPoints));
    render(tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this._container, this._tripSortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._boardComponent, RenderPosition.BEFOREEND);
    this._renderPoints(sortedPoints, offers, destinations);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }
    this.render();
    const tripDaysContainer = document.querySelector(`.trip-days`);
    this._creatingPoint = new PointController(tripDaysContainer, this._onDataChange, this._onViewChange, this._pointsModel.getOffers(), this._pointsModel.getDestinations());
    EMPTY_POINT.type = DEFAULT_TYPE;
    this._creatingPoint.render(EMPTY_POINT, PointsControllerMode.ADD);
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EMPTY_POINT) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._api.createPoint(newData)
          .then((pointModel) => {
            this._pointsModel.addPoint(pointModel);
            pointController.render(pointModel, PointsControllerMode.VIEW);
            const destroyedPoint = this._showedPointControllers.pop();
            destroyedPoint.destroy();
            this._showedPointControllers = [].concat(pointController, this._showedPointControllers);
            this.render();
            this._statistics.rerender(this._pointsModel);
            this._statistics.hide();
          })
          .catch(() => pointController.shake());
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
          this.render();
          this._statistics.rerender(this._pointsModel);
          this._statistics.hide();
        })
        .catch(() => pointController.shake());
    } else {
      this._api.updatePoint(oldData.id, newData)
      .then((pointModel) => {
        const isUpdatePointSuccessfull = this._pointsModel.updatePoint(oldData.id, pointModel);
        if (isUpdatePointSuccessfull) {
          pointController.render(pointModel, PointsControllerMode.VIEW);
          this._updatePoints();
          this.render();
          this._statistics.rerender(this._pointsModel);
          this._statistics.hide();
        }
      })
      .catch(() => pointController.shake());
    }
  }

  _onFilterChange() {
    this._onViewChange();
    this._updatePoints();
  }

  _onSortTypeChange(sortType) {
    const points = this._pointsModel.getPointsWithActiveFilter();
    const offers = this._pointsModel.getOffers();
    const destinations = this._pointsModel.getDestinations();
    const sortedPoints = this._sortPointsBySortType(points, sortType);

    this._onViewChange();
    this._removePoints();
    this._renderPoints(sortedPoints, offers, destinations);
  }

  _onViewChange() {
    this._removeCreatingPoint();
    this._showedPointControllers.forEach((element) => element.setDefaultView());
  }

  _removePoints() {
    this._showedPointControllers.forEach((element) => element.destroy());
    this._showedPointControllers = [];
  }

  _removeCreatingPoint() {
    if (this._creatingPoint) {
      this._creatingPoint.destroy();
      this._creatingPoint = null;
    }
  }

  _renderPoints(points, offers, destinations) {
    const tripDaysContainer = document.querySelector(`.trip-days`);
    const newPoints = renderPoints(tripDaysContainer, points, this._sortType, this._onDataChange, this._onViewChange, offers, destinations);
    this._showedPointControllers = this._showedPointControllers.concat(newPoints);
  }

  _updatePoints() {
    const points = this._pointsModel.getPointsWithActiveFilter();
    const offers = this._pointsModel.getOffers();
    const destinations = this._pointsModel.getDestinations();
    const sortedPoints = this._sortPointsBySortType(points, this._sortType);

    this._removePoints();
    this._renderPoints(sortedPoints, offers, destinations);
  }

  _sortPointsBySortType(points, sortType) {
    let sortedPoints = [];
    switch (sortType) {
      case SortType.DEFAULT:
        sortedPoints = points.slice();
        this._sortType = SortType.DEFAULT;
        break;
      case SortType.DURATION:
        sortedPoints = points.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
        this._sortType = SortType.DURATION;
        break;
      case SortType.PRICE:
        sortedPoints = points.slice().sort((a, b) => b.basePrice - a.basePrice);
        this._sortType = SortType.PRICE;
        break;
    }
    return sortedPoints;
  }
}
