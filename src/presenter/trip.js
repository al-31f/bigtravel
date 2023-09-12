import SiteMenuView from '../view/menu.js';
import TripInfoView from '../view/trip-info.js';
import TripSortView from '../view/trip-sort.js';
import TripPointListView from '../view/trip-point-list.js';
import TripCostView from '../view/trip-cost.js';
import TripPointPresenter from '../presenter/trip-point.js';
import {sortTaskDown, comparePrice, compareDuration} from '../utils/trip-point.js';
import {SortType, UpdateType, UserAction} from '../consts.js';
import {renderElement, RenderPosition, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';

const POINTS_NUMBER = 20;

export default class Trip {
  constructor(tripInfoContainer, tripMainContainer, pointsModel, offersModel, filterModel) {
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._filterModel = filterModel;
    this._tripInfoContainer = tripInfoContainer;
    this._tripMainContainer = tripMainContainer;
    this._renderedPointCount = POINTS_NUMBER;
    this._tripPointPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._tripSortComponent = null;

    this._tripSiteMenuComponent = new SiteMenuView();
    //this._tripFiltersComponent = new FiltersView('past');
    this._tripInfoComponent = new TripInfoView();
    //this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripPointListComponent = new TripPointListView();
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    renderElement(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);

    const menuElement = this._tripInfoContainer.querySelector('.trip-controls__navigation');
    //const filtersElement = this._tripInfoContainer.querySelector('.trip-controls__filters');
    const tripCostElement = this._tripInfoContainer.querySelector('.trip-main__trip-info');

    renderElement(menuElement, this._tripSiteMenuComponent, RenderPosition.BEFOREEND);
    //renderElement(filtersElement, this._tripFiltersComponent, RenderPosition.BEFOREEND);
    renderElement(tripCostElement, new TripCostView(this._getPoints(), this._getOffers()), RenderPosition.BEFOREEND);

    this._renderBoard();
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
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
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
    const tripPointPresenter = new TripPointPresenter(this._tripMainContainer, this._handleViewAction, this._handleModeChange);
    tripPointPresenter.init(pointData, specOfferData);
    this._tripPointPresenter[pointData.id] = tripPointPresenter;
  }

  _renderPoints(points) {
    // отрисовка всех точек
    for (let i = 0; i < points.length; i++) {
      this._renderPoint(points[i], this._getOffers());
    }
  }

  /* вероятно ненужный метод
  _clearPointsList() {
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripPointPresenter = {};
  }
*/
  _renderNoPolints() {
    console.log('no points');
    // Метод для рендеринга заглушки
  }

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const pointCount = this._getPoints().length;

    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};

    remove(this._tripSortComponent);
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
    const points = this._getPoints();
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this._renderNoPolints();
      return;
    }

    this._renderSort();
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
    renderElement(this._tripMainContainer, this._tripPointListComponent, RenderPosition.BEFOREEND);

    // Теперь, когда _renderBoard рендерит доску не только на старте,
    // но и по ходу работы приложения, нужно заменить
    // константу TASK_COUNT_PER_STEP на свойство _renderedTaskCount,
    // чтобы в случае перерисовки сохранить N-показанных карточек
    //this._renderPoints(points.slice(0, Math.min(pointsCount, this._renderedPointCount)));
    //не ренедерит все точки после фильтрации(строка выше)
    this._renderPoints(points.slice());


  }
}
