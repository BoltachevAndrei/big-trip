import Api from './api/index.js';
import Provider from './api/provider.js';
import Store from './api/store.js';
import {render, RenderPosition} from './utils/render.js';
import FiltersController from './controllers/filters-controller.js';
import TripController from './controllers/trip-controller.js';
import Menu, {MenuItem} from './components/menu.js';
import Statisctics from './components/statistics.js';
import PointsModel from './models/points-model.js';
import 'flatpickr/dist/flatpickr.css';

const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const AUTHORIZATION_KEY = `Basic kTy9GIdsz2317rD`;
const REMOTE_HOST = `https://htmlacademy-es-10.appspot.com/big-trip`;

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      document.title += `[SW]`;
      // Действие, в случае успешной регистрации ServiceWorker
    })
    .catch(() => {
      document.title += `[no SW]`;
      // Действие, в случае ошибки при регистрации ServiceWorker
    });
});

const api = new Api(REMOTE_HOST, AUTHORIZATION_KEY);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const pointsModel = new PointsModel();

const menuContainer = document.querySelector(`.trip-controls h2:nth-of-type(1)`);
const menuComponent = new Menu();
render(menuContainer, menuComponent, RenderPosition.AFTER);

const filtersContainer = document.querySelector(`.trip-controls h2:nth-of-type(2)`);
const filtersController = new FiltersController(filtersContainer, pointsModel);

const tripPointsContainer = document.querySelector(`.trip-events`);
const tripController = new TripController(tripPointsContainer, pointsModel, apiWithProvider);

apiWithProvider.getDestinations()
  .then((destinations) => pointsModel.setDestinations(destinations))
  .then(() => apiWithProvider.getOffers())
  .then((offers) => pointsModel.setOffers(offers))
  .then(() => apiWithProvider.getPoints())
  .then((points) => {
    pointsModel.setPoints(points);

    filtersController.render();

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

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronizeStatus()) {
    apiWithProvider.sync()
      .then(() => {
        // Действие, в случае успешной синхронизации
      })
      .catch(() => {
        // Действие, в случае ошибки синхронизации
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
