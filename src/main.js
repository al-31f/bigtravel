import { menuTemplate } from './view/menu.js';
import { filtersTemplate } from './view/filters.js';
import { tripCostTemplate } from './view/trip-cost.js';
import { tripInfoTemplate } from './view/trip-info.js';
import { tripSortTemplate } from './view/trip-sort.js';
import { tripPointListTemplate } from './view/trip-point-list.js';
import { tripPointTemplate } from './view/trip-point.js';
import { editFormTemplate } from './view/edit-form.js';

const POINTS_NUMBER = 3;
const menuElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripInfoElement = document.querySelector('.trip-main');

const tripSortElement = document.querySelector('.trip-events');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(menuElement, menuTemplate(), 'beforeend');
render(filtersElement, filtersTemplate(), 'beforeend');
render(tripInfoElement, tripInfoTemplate(), 'afterbegin');

const tripCostElement = tripInfoElement.querySelector('.trip-main__trip-info');

render(tripCostElement, tripCostTemplate(), 'beforeend');
render(tripSortElement, tripSortTemplate(), 'afterbegin');
render(tripSortElement, tripPointListTemplate(), 'beforeend');

const tripPointListElement = tripSortElement.querySelector('.trip-events__list');

render(tripPointListElement, editFormTemplate(), 'beforeend');

for (let i = 0; i < POINTS_NUMBER; i++) {
  render(tripPointListElement, tripPointTemplate(), 'beforeend');
}
