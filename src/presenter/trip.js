import SiteMenuView from '../view/menu.js';
import FiltersView from '../view/filters.js';
import TripInfoView from '../view/trip-info.js';
import TripSortView from '../view/trip-sort.js';
import TripPointListView from '../view/trip-point-list.js';
import TripCostView from '../view/trip-cost.js';
import {updateItem} from '../utils/common.js';
import TripPointPresenter from '../presenter/trip-point.js';
import {sortTaskDown, comparePrice, compareDuration} from '../utils/trip-point.js';
import {SortType} from '../consts.js';

import { renderElement, RenderPosition} from '../utils/render.js';

const POINTS_NUMBER = 20;

export default class Trip {
  constructor(tripInfoContainer, tripMainContainer) {
    this._tripInfoContainer = tripInfoContainer;
    this._tripMainContainer = tripMainContainer;
    this._tripPointPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._tripSiteMenuComponent = new SiteMenuView();
    this._tripFiltersComponent = new FiltersView();
    this._tripInfoComponent = new TripInfoView();
    this._tripSortComponent = new TripSortView();
    this._tripPointListComponent = new TripPointListView();
    this._handleTripPointChange = this._handleTripPointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
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

  _handleModeChange() {
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleTripPointChange(updatedTripPoint) {
    this._boardTasks = updateItem(this._boardTasks, updatedTripPoint);
    console.log(updatedTripPoint , updatedTripPoint.id);
    this._tripPointPresenter[updatedTripPoint.id].init(updatedTripPoint, this.boardSpecOffers);
  }

  _sortTasks(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {

      case SortType.DEFAULT:
        this._boardTasks.sort(sortTaskDown);
        break;

        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        //this._boardTasks = this._sourcedBoardTasks.slice();

      case SortType.PRICE_DOWN:
        this._boardTasks.sort(comparePrice);
        break;

      case SortType.TIME_DOWN:
        this._boardTasks.sort(compareDuration);
        break;
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    // - Сортируем задачи
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTasks(sortType);
    console.log(sortType);
    // - Очищаем список
    // - Рендерим список заново
    this._clearPointsList();
    //this._clearTaskList();
    this._renderPoints();
    //this._renderTaskList();
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    renderElement(this._tripMainContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(pointData, specOfferData) {
    //отрисовка одной точки
    const tripPointPresenter = new TripPointPresenter(this._tripMainContainer, this._handleTripPointChange, this._handleModeChange);
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
    //console.log(this._boardTasks);
    this._sortTasks(this._currentSortType);
    console.log(this._boardTasks);
    this._renderPoints();

  }
}
