import API from './api.js';
import {render, RenderPosition} from './utils/render.js';
import FiltersController from './controllers/filters-controller.js';
import TripController from './controllers/trip-controller.js';
import Menu, {MenuItem} from './components/menu.js';
import Statisctics from './components/statistics.js';
import PointsModel from './models/points-model.js';

const AUTHORIZATION_KEY = `Basic kTy9GIdsz2317rD`;
const REMOTE_HOST = `https://htmlacademy-es-10.appspot.com/big-trip`;

const api = new API(REMOTE_HOST, AUTHORIZATION_KEY);
const pointsModel = new PointsModel();

const menuContainer = document.querySelector(`.trip-controls h2:nth-of-type(1)`);
const menuComponent = new Menu();
render(menuContainer, menuComponent, RenderPosition.AFTER);

const filtersContainer = document.querySelector(`.trip-controls h2:nth-of-type(2)`);
const filtersController = new FiltersController(filtersContainer, pointsModel);
filtersController.render();

const tripPointsContainer = document.querySelector(`.trip-events`);
const tripController = new TripController(tripPointsContainer, pointsModel, api);

api.getDestinations()
  .then((destinations) => pointsModel.setDestinations(destinations))
  .then(() => api.getOffers())
  .then((offers) => pointsModel.setOffers(offers))
  .then(() => api.getPoints())
  .then((points) => {
    pointsModel.setPoints(points);

    const statisticsComponent = new Statisctics(pointsModel);
    render(tripPointsContainer, statisticsComponent, RenderPosition.AFTER);
    statisticsComponent.hide();
    menuComponent.setOnChange((menuItem) => {
      switch (menuItem) {
        case MenuItem.NEW_EVENT:
          menuComponent.setActiveItem(MenuItem.TABLE);
          statisticsComponent.hide();
          tripController.show();
          tripController.createPoint();
          break;
        case MenuItem.TABLE:
          statisticsComponent.hide();
          tripController.show();
          break;
        case MenuItem.STATS:
          statisticsComponent.show();
          tripController.hide();
          break;
      }
    });

    tripController.render();
  });
