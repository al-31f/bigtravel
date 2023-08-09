import SiteMenuView from '../view/menu.js';
import FiltersView from '../view/filters.js';
import TripInfoView from '../view/trip-info.js';
import TripSortView from '../view/trip-sort.js';
import TripPointListView from '../view/trip-point-list.js';
import TripCostView from '../view/trip-cost.js';
import {updateItem} from '../utils/common.js';
import TripPointPresenter from '../presenter/trip-point.js';

import { renderElement, RenderPosition, replace, remove } from '../utils/render.js';

const POINTS_NUMBER = 20;

export default class Trip {
  constructor(tripInfoContainer, tripMainContainer) {
    this._tripInfoContainer = tripInfoContainer;
    this._tripMainContainer = tripMainContainer;
    this._tripPointPresenter = {};

    this._tripSiteMenuComponent = new SiteMenuView();
    this._tripFiltersComponent = new FiltersView();
    this._tripInfoComponent = new TripInfoView();
    this._tripSortComponent = new TripSortView();
    this._tripPointListComponent = new TripPointListView();
    this._handleTripPointChange = this._handleTripPointChange.bind(this);
  }

  init(pointsData, specOffersData) {
    this._boardTasks = pointsData.slice();
    this.boardSpecOffers = specOffersData.slice();

    renderElement(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);

    const menuElement = this._tripInfoContainer.querySelector('.trip-controls__navigation');
    const filtersElement = this._tripInfoContainer.querySelector('.trip-controls__filters');
    const tripCostElement = this._tripInfoContainer.querySelector('.trip-main__trip-info');

    renderElement(menuElement, this._tripSiteMenuComponent, RenderPosition.BEFOREEND);
    renderElement(filtersElement, this._tripFiltersComponent, RenderPosition.BEFOREEND);
    renderElement(tripCostElement, new TripCostView(pointsData, specOffersData), RenderPosition.BEFOREEND);

    this._renderSort();
    this._renderBoard();
  }

  _handleTripPointChange(updatedTripPoint) {
    this._boardTasks = updateItem(this._boardTasks, updatedTripPoint);
    console.log(updatedTripPoint , updatedTripPoint.id);
    this._tripPointPresenter[updatedTripPoint.id].init(updatedTripPoint, this.boardSpecOffers);
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    renderElement(this._tripMainContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(pointData, specOfferData) {
    //отрисовка одной точки
    const tripPointPresenter = new TripPointPresenter(this._tripMainContainer, this._handleTripPointChange);
    tripPointPresenter.init(pointData, specOfferData);
    this._tripPointPresenter[pointData.id] = tripPointPresenter;
  }

  _renderPoints() {
    // отрисовка всех точек
    for (let i = 0; i < POINTS_NUMBER; i++) {
      this._renderPoint(this._boardTasks[i], this.boardSpecOffers);
    }
  }

  _clearPointsList() {
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripPointPresenter = {};
  }

  _renderNoPolints() {
    // Метод для рендеринга заглушки
  }


  _renderBoard() {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
    renderElement(this._tripMainContainer, this._tripPointListComponent, RenderPosition.BEFOREEND);
    this._renderPoints();

  }
}
