import TripPointListView from '../view/trip-point-list.js';
import TripPointView from '../view/trip-point.js';
import EditFormView from '../view/edit-form.js';
import { renderElement, RenderPosition, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../consts.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripPoint {
  constructor(tripMainContainer, changeData, changeMode, destinationsModel, offersIndexModel) {
    this._tripMainContainer = tripMainContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._destinationsModel = destinationsModel;
    this._offersIndexModel = offersIndexModel;

    this._tripPointComponent = null;
    this._tripPointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._tripPointListComponent = new TripPointListView();
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(pointData, specOfferData) {
    this._pointData = pointData;
    this._specOfferData = specOfferData;
    this._mode = Mode.DEFAULT;

    this._renderPoint();
  }

  _renderPoint() {

    const prevTripPointComponent = this._tripPointComponent;
    const prevTripPointEditComponent = this._tripPointEditComponent;
    // текущая функция renderTask в main.js
    this._tripPointComponent = new TripPointView(this._pointData, this._specOfferData);
    this._tripPointEditComponent = new EditFormView(this._pointData, this._specOfferData, this._destinationsModel, this._offersIndexModel);

    const tripPointListElement = this._tripMainContainer.querySelector('.trip-events__list');

    this._tripPointComponent.setFavoriteClickHandler(this._handleFavoriteClick);


    //открывает форму редактирования по стрелке
    this._replacePointToEditForm();

    //нажатие на кнопку удалить
    this._deletePoint(this._pointData);


    //скрывает форму редактирования по стрелке
    this._tripPointEditComponent.setEditClickHandler(() => {
      this._tripPointEditComponent.resetInput(this._pointData);
      this._replaceEditFormToPoint();
    //  console.log('click close');
    });

    //скрывает форму редактирования по сабмиту
    this._tripPointEditComponent.setSubmitForm(() => {
      this._replaceEditFormToPoint();
      //  console.log('submit');
      this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        Object.assign(
          {},
          this._tripPointEditComponent._pointState,
        ),
      );
    });

    //сменa типа точки путешествия
    this._tripPointEditComponent.pointTypeChange(() => {
      //console.log('change type', this._tripPointComponent);
    });

    //ввод города точки путешествия
    this._tripPointEditComponent.pointDestinationInput(() => {
    //  console.log('change Input', this._tripPointComponent);
    });

    //отрисовка точки после проверки
    if (prevTripPointComponent === null || prevTripPointEditComponent === null) {
      renderElement(tripPointListElement, this._tripPointComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    //заменяем элемент на новый, если произошли изменения данных
    if (this._mode === Mode.DEFAULT) {
      replace(this._tripPointComponent, prevTripPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._tripPointEditComponent, prevTripPointEditComponent);
    }

    remove(prevTripPointComponent);
    remove(prevTripPointEditComponent);

  }

  _replacePointToEditForm() {
    this._tripPointComponent.setEditClickHandler(() => {
      replace(this._tripPointEditComponent,this._tripPointComponent);
      //    console.log('click open');
      this._changeMode();
      this._mode = Mode.EDITING;
    });
  }

  _replaceEditFormToPoint() {
    replace(this._tripPointComponent, this._tripPointEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _deletePoint(point) {
    this._tripPointEditComponent.setDeletePoint(() => {
      this.destroy();
      this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point,
      );
      //console.log('del');
    });
  }

  destroy() {
    remove(this._tripPointComponent);
    remove(this._tripPointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditFormToPoint();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._pointData,
        {
          favorite: !JSON.parse(this._pointData.favorite),
        },
      ),
    );
    //console.log('fav', this._pointData);

  }

}
