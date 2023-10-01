import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';

import { genPointsData } from './mock/point-data.js';
import PointsModel from './model/points.js';
import { genSpecOffersData } from './mock/point-spec-offers-data.js';
import OffersModel from './model/offers.js';
import FilterModel from './model/filter.js';

import Api from './api.js';

import TripStats from './view/stats.js';
import TripMenu from './view/menu.js';
import { renderElement, RenderPosition } from './utils/render.js';

const AUTHORIZATION = 'Basic hsS2ssd3dsfsSwcssls1sa2j';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

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
//console.log(pointsModel);
//console.log(offersModel);

const api = new Api(END_POINT, AUTHORIZATION);

//вывод для наглядности. удалить потом
api.getServerPoints();

api.getPoints().then((points) => {
  console.log('adopted points from server:', points[0]);
  return points;
}).then((points) => console.log(points.map(PointsModel.adaptToServer)[0]));

api.getOffers().then((offers) => {
  //console.log('adopted offers from server:', offers);
});


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

/*const menu = new TripMenu();
const stats = new TripStats();
renderElement(tripEventsElement, stats, RenderPosition.BEFOREEND);
//console.log(tripEventsElement, menu);

//const menuItems = menu.getElement().querySelectorAll('a');
//console.log(menu);
*/
export {pointsData};

