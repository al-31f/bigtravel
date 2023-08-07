import TripPointListView from '../view/trip-point-list.js';
import TripPointView from '../view/trip-point.js';
import EditFormView from '../view/edit-form.js';
import { renderElement, RenderPosition, replace, remove} from '../utils/render.js';

export default class TripPoint {
  constructor(tripMainContainer) {
    this._tripMainContainer = tripMainContainer;

    this._tripPointListComponent = new TripPointListView();
  }

  init(pointData, specOfferData) {
    this._pointData = pointData;
    this.specOfferData = specOfferData;

    this._renderPoint();
  }

  _renderPoint() {
    // отрисовка одной точки,
    // текущая функция renderTask в main.js
    const tripPoint = new TripPointView(this._pointData, this.specOfferData);
    const tripPointEdit = new EditFormView(this._pointData);

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

}
