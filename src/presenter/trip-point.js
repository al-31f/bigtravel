import TripPointListView from '../view/trip-point-list.js';
import TripPointView from '../view/trip-point.js';
import EditFormView from '../view/edit-form.js';
import { renderElement, RenderPosition, replace, remove} from '../utils/render.js';

export default class TripPoint {
  constructor(tripMainContainer, changeData) {
    this._tripMainContainer = tripMainContainer;
    this._changeData = changeData;

    this._tripPointComponent = null;
    this._tripPointEditComponent = null;

    this._tripPointListComponent = new TripPointListView();
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(pointData, specOfferData) {
    this._pointData = pointData;
    this.specOfferData = specOfferData;

  

    this._renderPoint();
  }

  _renderPoint() {

    const prevTripPointComponent = this._tripPointComponent;
    const prevTripPointEditComponent = this._tripPointEditComponent;
    // отрисовка одной точки,
    // текущая функция renderTask в main.js
    this._tripPointComponent = new TripPointView(this._pointData, this.specOfferData);
    this._tripPointEditComponent = new EditFormView(this._pointData);

    //const tripEventsElement = document.querySelector('.trip-events');
    const tripPointListElement = this._tripMainContainer.querySelector('.trip-events__list');

    //renderElement(tripPointListElement, this._tripPointComponent.getElement(), RenderPosition.BEFOREEND);

    this._tripPointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    //открывает форму редактирования по стрелке (открытие и скрытие формы вынести в отдельные методы)
    this._tripPointComponent.setEditClickHandler(() => {
      replace(this._tripPointEditComponent,this._tripPointComponent);
      console.log('click open');
    });

    //скрывает форму редактирования по стрелке
    this._tripPointEditComponent.setEditClickHandler(() => {
      replace(this._tripPointComponent, this._tripPointEditComponent);
      console.log('click close');
    });

    //скрывает форму редактирования по сабмиту
    this._tripPointEditComponent.setSubmitForm(() => {
      replace(this._tripPointComponent, this._tripPointEditComponent);
      console.log('submit');
    });

    //отрисовка точки после проаерки
    if (prevTripPointComponent === null || prevTripPointEditComponent === null) {
      renderElement(tripPointListElement, this._tripPointComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    //заменяем элемент на новый, если произошли изменения данных
    if (tripPointListElement.contains(prevTripPointComponent.getElement())) {
      replace(this._tripPointComponent, prevTripPointComponent);
    }

    if (tripPointListElement.contains(prevTripPointEditComponent.getElement())) {
      replace(this._tripPointEditComponent, prevTripPointEditComponent);
    }

    remove(prevTripPointComponent);
    remove(prevTripPointEditComponent);

  }


  destroy() {
    remove(this._tripPointComponent);
    remove(this._tripPointEditComponent);
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._pointData,
        {
          favorite: !JSON.parse(this._pointData.favorite),
        },
      ),
    );
  }
}
