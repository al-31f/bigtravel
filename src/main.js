import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';

import { genPointsData } from './mock/point-data.js';
import PointsModel from './model/points.js';
import { genSpecOffersData } from './mock/point-spec-offers-data.js';
import OffersModel from './model/offers.js';
import FilterModel from './model/filter.js';


const tripHeaderElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');

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


const filterModel = new FilterModel();
//создает и инициализирует экземпляр презентера
const tripPresenter = new TripPresenter(tripHeaderElement, tripEventsElement, pointsModel, offersModel, filterModel);
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


export {pointsData};

