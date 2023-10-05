import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';

import PointsModel from './model/points.js';
import OffersModel from './model/offers.js';
import DestinationsIndexModel from './model/destinations.js';
import OffersIndexModel from './model/offers-index.js';

import FilterModel from './model/filter.js';

import { UpdateType } from './consts.js';

import Api from './api.js';


const AUTHORIZATION = 'Basic hsS2ssd3dsfsSwcssls1sa2j';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const tripHeaderElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');

//генерируем данные
//const pointsData = genPointsData();
//const specOffersData = genSpecOffersData();

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsIndexModel();
const offersIndexModel = new OffersIndexModel();

//создает и инициализирует экземпляр презентера
const tripPresenter = new TripPresenter(tripHeaderElement, tripEventsElement, pointsModel, offersModel, filterModel, destinationsModel, offersIndexModel, api);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel);
tripPresenter.init();
filterPresenter.init();

const newPointClickHandle = () => {
  document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
    evt.preventDefault();
    console.log('click');
    tripPresenter.createPoint();
  });
};
newPointClickHandle();

api.getOffers().then((offers) => offersModel.setOffers(UpdateType.INIT, offers)).catch(() => {
  offersModel.setOffers(UpdateType.INIT, []);
});

api.getPoints().then((points) => {
  pointsModel.setPoints(UpdateType.INIT, points);
  console.log(points[0]);
}).catch(() => {
  pointsModel.setPoints(UpdateType.INIT, []);
});

api.getOffersIndex().then((offersIndex) => {
  offersIndexModel.setOffers(UpdateType.INIT, offersIndex);
});

api.getDestinations().then((destinations) => {
  destinationsModel.setDestinations(UpdateType.INIT, destinations);
});
