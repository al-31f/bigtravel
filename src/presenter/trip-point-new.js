import {nanoid} from 'nanoid';
import EditFormView from '../view/edit-form.js';
import { renderElement, RenderPosition, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../consts.js';
import {PointDataDefault} from '../consts.js';

export default class TripPointNew {
  constructor(tripMainContainer, changeData) {
    this._tripMainContainer = tripMainContainer;
    this._changeData = changeData;

    this._tripPointEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    //this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

  }

  init() {
    if (this._tripPointEditComponent !== null) {
      return;
    }

    this._tripPointEditComponent = new EditFormView(PointDataDefault, '');

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
      // Пока у нас нет сервера, который бы после сохранения
      // выдывал честный id задачи, нам нужно позаботиться об этом самим
      //Object.assign({id: nanoid()}, point),
      Object.assign({id: '5'}, point),
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

}
