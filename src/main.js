import { renderElement, RenderPosition } from './utils.js';

import SiteMenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import TripPointListView from './view/trip-point-list.js';
import TripSortView from './view/trip-sort.js';
import TripPointView from './view/trip-point.js';
import EditFormView from './view/edit-form.js';

import { genPointsData } from './mock/point-data.js';
import { genSpecOffersData } from './mock/point-spec-offers-data.js';

const POINTS_NUMBER = 20;
const menuElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripInfoElement = document.querySelector('.trip-main');

const tripSortElement = document.querySelector('.trip-events');

//генерируем данные
const pointsData = genPointsData();
const specOffersData = genSpecOffersData();
console.log(pointsData);
//console.log(pointData);
console.log(specOffersData);

renderElement(menuElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
renderElement(filtersElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);
renderElement(tripInfoElement, new TripInfoView().getElement(), RenderPosition.AFTERBEGIN);

const tripCostElement = tripInfoElement.querySelector('.trip-main__trip-info');

renderElement(tripCostElement, new TripCostView(pointsData, specOffersData).getElement(), RenderPosition.BEFOREEND);
renderElement(tripSortElement, new TripSortView().getElement(), RenderPosition.AFTERBEGIN);
renderElement(tripSortElement, new TripPointListView().getElement(), RenderPosition.BEFOREEND);

const tripPointListElement = tripSortElement.querySelector('.trip-events__list');

//renderElement(tripPointListElement, new EditFormView(pointsData[0]).getElement(), RenderPosition.BEFOREEND);

//рендерим точки маршрута
for (let i = 0; i < POINTS_NUMBER; i++) {
  const tripPoint = new TripPointView(pointsData[i], specOffersData);
  const tripPointEdit = new EditFormView(pointsData[i]);
  renderElement(tripPointListElement, tripPoint.getElement(), RenderPosition.BEFOREEND);
  console.log(tripPoint);


  //открывает форму редактирования по стрелке
  tripPoint.setEditClickHandler(() => {
    tripPointListElement.replaceChild(tripPointEdit.getElement(), tripPoint.getElement());
    console.log('click');
  });

  //скрывает форму редактирования по стрелке
  tripPointEdit.setEditClickHandler(() => {
    tripPointListElement.replaceChild(tripPoint.getElement(), tripPointEdit.getElement());
    console.log('click');
  });

  //скрывает форму редактирования по сабмиту
  tripPointEdit.setSubmitForm(() => {
    tripPointListElement.replaceChild(tripPoint.getElement(), tripPointEdit.getElement());
    console.log('submit');
  });

}

export {pointsData};
