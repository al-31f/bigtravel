//import BoardView from '../view/board.js';
//import SortView from '../view/sort.js';
//import TaskListView from '../view/task-list.js';
//import NoTaskView from '../view/no-task.js';
//import TaskView from '../view/task.js';
//import TaskEditView from '../view/task-edit.js';
//import LoadMoreButtonView from '../view/load-more-button.js';
//import {render, RenderPosition} from '../utils/render.js';
import SiteMenuView from '../view/menu.js';
import FiltersView from '../view/filters.js';
import TripInfoView from '../view/trip-info.js';
import TripSortView from '../view/trip-sort.js';
import TripPointListView from '../view/trip-point-list.js';
import TripCostView from '../view/trip-cost.js';
import TripPointView from '../view/trip-point.js';
import EditFormView from '../view/edit-form.js';
import { renderElement, RenderPosition, replace, remove} from '../utils/render.js';
//import TripPointView from './view/trip-point.js';

const POINTS_NUMBER = 20;

export default class Trip {
  constructor(tripInfoContainer, tripMainContainer) {
    this._tripInfoContainer = tripInfoContainer;
    this._tripMainContainer = tripMainContainer;

    this._tripSiteMenuComponent = new SiteMenuView();
    this._tripFiltersComponent = new FiltersView();
    this._tripInfoComponent = new TripInfoView();
    this._tripSortComponent = new TripSortView();
    this._tripPointListComponent = new TripPointListView();
    
    //this._tripComponent = new BoardView();
    //this._sortComponent = new SortView();
    //this._taskListComponent = new TaskListView();
    //this._noTaskComponent = new NoTaskView();
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

  _renderSort() {
    // Метод для рендеринга сортировки
    renderElement(this._tripMainContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(pointData, specOfferData) {
    // отрисовка одной точки,
    // текущая функция renderTask в main.js
    const tripPoint = new TripPointView(pointData, specOfferData);
    const tripPointEdit = new EditFormView(pointData);

    //const tripEventsElement = document.querySelector('.trip-events');
    const tripPointListElement = this._tripMainContainer.querySelector('.trip-events__list');

    renderElement(tripPointListElement, tripPoint.getElement(), RenderPosition.BEFOREEND);
    console.log(tripPoint);


    //открывает форму редактирования по стрелке
    tripPoint.setEditClickHandler(() => {
      replace(tripPointEdit,tripPoint);
      console.log('click');
    });

    //скрывает форму редактирования по стрелке
    tripPointEdit.setEditClickHandler(() => {
      replace(tripPoint, tripPointEdit);
      console.log('click');
    });

    //скрывает форму редактирования по сабмиту
    tripPointEdit.setSubmitForm(() => {
      replace(tripPoint, tripPointEdit);
      console.log('submit');
    });
  }

  _renderPoints() {
    // отрисовка всех точек
    for (let i = 0; i < POINTS_NUMBER; i++) {
      this._renderPoint(this._boardTasks[i], this.boardSpecOffers);
    }
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
