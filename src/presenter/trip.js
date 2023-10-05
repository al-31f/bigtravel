import SiteMenuView from '../view/menu.js';
import TripInfoView from '../view/trip-info.js';
import TripSortView from '../view/trip-sort.js';
import TripPointListView from '../view/trip-point-list.js';
import TripCostView from '../view/trip-cost.js';
import LoadingView from '../view/loading.js';

import TripPointPresenter from '../presenter/trip-point.js';
import TripPointNewPresenter from './trip-point-new.js';
import {sortTaskDown, comparePrice, compareDuration} from '../utils/trip-point.js';
import {SortType, UpdateType, UserAction, FilterType} from '../consts.js';
import {renderElement, RenderPosition, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import TripStatsView from '../view/stats.js';

const POINTS_NUMBER = 20;

export default class Trip {
  constructor(tripInfoContainer, tripMainContainer, pointsModel, offersModel, filterModel, destinationsModel, offersIndexModel, api) {
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._filterModel = filterModel;
    this._destinationsModel = destinationsModel;
    this._offersIndexModel = offersIndexModel;

    this._tripInfoContainer = tripInfoContainer;
    this._tripMainContainer = tripMainContainer;
    this._renderedPointCount = POINTS_NUMBER;
    this._tripPointPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._api = api;

    this._tripSortComponent = null;
    this._tripCostComponent = null;

    this._tripSiteMenuComponent = new SiteMenuView();
    this._tripStatsComponent = new TripStatsView(this._pointsModel.getPoints(), this._offersIndexModel);
    //this._tripFiltersComponent = new FiltersView('past');
    this._tripInfoComponent = new TripInfoView();
    //this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripPointListComponent = new TripPointListView();
    this._loadingComponent = new LoadingView();
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    //this._offersIndexModel.addObserver(this._handleModelEvent);
    //this._destinationsModel.addObserver(this._handleModelEvent);

    this._tripPointNewPresenter = new TripPointNewPresenter(this._tripPointListComponent, this._handleViewAction, this._destinationsModel, this._offersIndexModel);
  }

  init() {
    renderElement(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);

    const menuElement = this._tripInfoContainer.querySelector('.trip-controls__navigation');

    renderElement(menuElement, this._tripSiteMenuComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
    this.changeMenu();
  }

  createPoint() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._tripPointNewPresenter.init();
  }

  _getPoints() {

    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {

      case SortType.DEFAULT:
        return filtredPoints.sort(sortTaskDown);

      case SortType.PRICE_DOWN:
        return filtredPoints.sort(comparePrice);

      case SortType.TIME_DOWN:
        return filtredPoints.sort(compareDuration);
    }

    return filtredPoints;
  }

  _getOffers() {
    return this._offersModel.getOffers();
  }


  _handleModeChange() {
    this._tripPointNewPresenter.destroy();
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._api.updatePoint(update).then((response) => {
          console.log(response);
          this._pointsModel.updatePoint(updateType, response);
        });
        break;
      case UserAction.ADD_POINT:
        //this._pointsModel.addPoint(updateType, update);
        this._api.addPoint(update).then((response) => {
          this._pointsModel.addPoint(updateType, response);
        });
        break;
      case UserAction.DELETE_POINT:
        //this._pointsModel.deletePoint(updateType, update);
        this._api.deletePoint(update).then(() => {
          // Обратите внимание, метод удаления задачи на сервере
          // ничего не возвращает. Это и верно,
          // ведь что можно вернуть при удалении задачи?
          // Поэтому в модель мы всё также передаем update
          this._pointsModel.deletePoint(updateType, update);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data, specOfferData) {
    //console.log(updateType, data, specOfferData);
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
      // - обновить часть списка (например, когда поменялось описание)
        this._tripPointPresenter[data.id].init(data, specOfferData);
        break;
      case UpdateType.MINOR:
      // - обновить список (например, когда задача ушла в архив)
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
      // - обновить всю доску (например, при переключении фильтра)
        this._clearBoard({resetRenderedPointCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    // - Сортируем задачи
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    console.log(sortType);
    this._clearBoard({resetRenderedTaskCount: true});

    this._renderBoard();
    // - Очищаем список
    // - Рендерим список заново
  }

  _renderSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }

    this._tripSortComponent = new TripSortView(this._currentSortType);

    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    renderElement(this._tripMainContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(pointData, specOfferData) {
    //отрисовка одной точки
    // const tripPointPresenter = new TripPointPresenter(this._tripMainContainer, this._handleTripPointChange, this._handleModeChange);
    const tripPointPresenter = new TripPointPresenter(this._tripMainContainer, this._handleViewAction, this._handleModeChange, this._destinationsModel, this._offersIndexModel);
    tripPointPresenter.init(pointData, specOfferData);
    this._tripPointPresenter[pointData.id] = tripPointPresenter;
  }

  _renderPoints(points) {
    // отрисовка всех точек
    for (let i = 0; i < points.length; i++) {
      this._renderPoint(points[i], this._getOffers());
    }
  }

  _renderLoading() {
    renderElement(this._tripMainContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoPolints() {
    console.log('no points');
    // Метод для рендеринга заглушки
  }

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const pointCount = this._getPoints().length;

    this._tripPointNewPresenter.destroy();
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};

    remove(this._tripSortComponent);
    remove(this._tripCostComponent);
    //remove(this._noTaskComponent);


    if (resetRenderedTaskCount) {
      this._renderedPointCount = POINTS_NUMBER;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this._renderedPointCount = Math.min(pointCount, this._renderedPointCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints();
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this._renderNoPolints();
      return;
    }

    const tripCostElement = this._tripInfoContainer.querySelector('.trip-main__trip-info');
    this._tripCostComponent = new TripCostView(this._getPoints(), this._getOffers());
    renderElement(tripCostElement, this._tripCostComponent, RenderPosition.BEFOREEND);

    this._renderSort();
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
    renderElement(this._tripMainContainer, this._tripPointListComponent, RenderPosition.BEFOREEND);

    //this._renderPoints(points.slice(0, Math.min(pointsCount, this._renderedPointCount)));
    //не ренедерит все точки после фильтрации(строка выше)
    this._renderPoints(points.slice());

    //вывод экрана статистики
    renderElement(this._tripMainContainer, this._tripStatsComponent, RenderPosition.BEFOREEND);

    this.showTrip();
    //console.log(this._getPoints());
  }

  hideTrip() {
    this._tripPointListComponent.hide('visually-hidden');
    this._tripStatsComponent.show('visually-hidden');
  }

  showTrip() {
    this._tripPointListComponent.show('visually-hidden');
    this._tripStatsComponent.hide('visually-hidden');
  }

  changeMenu() {
    const menuItems = this._tripSiteMenuComponent.getElement().querySelectorAll('a');
    //console.log(menuItems);
    //let checkedItem = menuItems[0];
    let prevCheckedItem = menuItems[0];

    menuItems.forEach((item) => {
      item.addEventListener('click', (evt) => {
        evt.preventDefault();
        console.log(item.textContent);
        if (item.classList.contains('trip-tabs__btn--active')) {
          console.log('nazhato uzhe');
        } else {
          prevCheckedItem.classList.remove('trip-tabs__btn--active');
          prevCheckedItem = item;
          item.classList.add('trip-tabs__btn--active');

          switch (item.textContent) {
            case 'Table':
              this.showTrip();
              this._currentSortType = SortType.DEFAULT;
              this._clearBoard({resetRenderedPointCount: true, resetSortType: true});
              this._renderBoard();
              break;
            case 'Stats':
            // - обновить список (например, когда задача ушла в архив)
              this.hideTrip();
              remove(this._tripSortComponent);
              break;
          }
        }
      });
    });

  }
}
