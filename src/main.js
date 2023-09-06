import TripPresenter from './presenter/trip.js';

import { genPointsData } from './mock/point-data.js';
import PointsModel from './model/points.js';
import { genSpecOffersData } from './mock/point-spec-offers-data.js';
import OffersModel from './model/offers.js';

const tripHeaderElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

//генерируем данные
const pointsData = genPointsData();
const specOffersData = genSpecOffersData();
//console.log(pointsData);
//console.log(specOffersData);

const pointsModel = new PointsModel();
pointsModel.setPoints(pointsData);

const offersModel = new OffersModel();
offersModel.setOffers(specOffersData);
console.log(pointsModel);
console.log(offersModel);

//создает и инициализирует экземпляр презентера
const tripPresenter = new TripPresenter(tripHeaderElement, tripEventsElement, pointsModel, offersModel);
tripPresenter.init();

export {pointsData};
