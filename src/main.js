import TripPresenter from './presenter/trip.js';

import { genPointsData } from './mock/point-data.js';
import { genSpecOffersData } from './mock/point-spec-offers-data.js';

const tripHeaderElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

//генерируем данные
const pointsData = genPointsData();
const specOffersData = genSpecOffersData();
console.log(pointsData);
console.log(specOffersData);

//создает и инициализирует экземпляр презентера
const tripPresenter = new TripPresenter(tripHeaderElement, tripEventsElement);
tripPresenter.init(pointsData, specOffersData);

export {pointsData};
