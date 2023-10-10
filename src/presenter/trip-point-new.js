import EditFormView from '../view/edit-form.js';
import { renderElement, RenderPosition, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../consts.js';
import {PointDataDefault} from '../consts.js';

export default class TripPointNew {
  constructor(tripMainContainer, changeData, destinationsModel, offersIndexModel) {
    this._tripMainContainer = tripMainContainer;
    this._changeData = changeData;
    this._destinationsModel = destinationsModel;
    this._offersIndexModel = offersIndexModel;

    this._tripPointEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);

  }

  init() {
    if (this._tripPointEditComponent !== null) {
      return;
    }
    this._tripPointEditComponent = new EditFormView(PointDataDefault, '', this._destinationsModel, this._offersIndexModel);

    this._tripPointEditComponent.setSubmitForm(this._handleFormSubmit);
    this._tripPointEditComponent.setDeletePoint(this._handleDeleteClick);
    renderElement(this._tripMainContainer, this._tripPointEditComponent.getElement(), RenderPosition.AFTERBEGIN);


    //изменение типа точки
    this._tripPointEditComponent.pointTypeChange(() => {
    });

    //ввод города точки путешествия
    this._tripPointEditComponent.pointDestinationInput(() => {
    });
  }


  destroy() {
    if (this._tripPointEditComponent === null) {
      return;
    }

    remove(this._tripPointEditComponent);
    this._tripPointEditComponent = null;
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

}
