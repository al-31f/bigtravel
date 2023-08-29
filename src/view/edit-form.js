import dayjs from 'dayjs';
//import AbstractView from './abstract.js';
import SmartView from './smart.js';
import {OFFER_TITLES, REAL_OFFER_PRICES} from '../mock/point-spec-offers-data.js';
import {DESTINATIONS, destinDescripts} from '../mock/point-data.js';
import {compareTwoDates} from '../utils/trip-point.js';

import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const renderDestinationList = (destinations) => {
  //console.log(destinations);
  let destinationList ='';
  destinations.forEach((destination) => {
    const destinationElement = `<option value="${destination}"></option>`;
    destinationList = destinationList + destinationElement;
  });
  return destinationList;
};


const renderOffers = (data, offersData) => {
  let offers = '';
  if (OFFER_TITLES[data.type] !== undefined) {

    let isChecked = '';
    for (let i = 0; i < OFFER_TITLES[data.type].length; i++) {
      const isCheckedArray = new Array(OFFER_TITLES[data.type].length);
      for (let j = 0; j < data.offers.length; j++) {
        if (OFFER_TITLES[data.type][i] === offersData.filter((offerData) => offerData.id.toString() === data.offers[j].toString())[0].title) {
        // если название оффера равно названию оффера, айди которого есть в массиве data.offers
          isChecked = 'checked';
          isCheckedArray[i] = isChecked;
        }
        //else {
        //  isChecked = '';
        //  isCheckedArray[i] = isChecked;
        //}
        //console.log(isCheckedArray, 'i=', i,'j=' , j);
      }

      //console.log(OFFER_TITLES[data.type][i], isChecked);

      const offer = `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${data.type}-${i}" type="checkbox" name="event-offer-luggage" ${isCheckedArray[i]}>
      <label class="event__offer-label" for="event-offer-${data.type}-${i}">
        <span class="event__offer-title">${OFFER_TITLES[data.type][i]}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${REAL_OFFER_PRICES[data.type][i]}</span>
      </label>
    </div>`;

      offers = offers + offer;
    }
  }
  //console.log(data.type);
  if (data.offers.length > 0) {
    //console.log('data', data.offers);
  }

  return offers;
};


const creatEeditFormTemplate = (data, offersData) => `<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${data.type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>

          <div class="event__type-item">
            <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
            <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
            <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
            <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
            <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
            <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
            <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" >
            <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
            <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
            <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
            <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
          </div>
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
      ${data.type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${data.destination}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${renderDestinationList(DESTINATIONS)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(data.begin).format('DD/MM/YY HH:mm')}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(data.end).format('DD/MM/YY HH:mm')}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${data.price}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${renderOffers(data, offersData)}
      

      </div>
    </section>

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${data.description}</p>
    </section>
  </section>
</form>
</li>`;

/*
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
          <label class="event__offer-label" for="event-offer-luggage-1">
            <span class="event__offer-title">Add luggage</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">50</span>
          </label>
        </div>

        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked>
          <label class="event__offer-label" for="event-offer-comfort-1">
            <span class="event__offer-title">Switch to comfort</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">80</span>
          </label>
        </div>

        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
          <label class="event__offer-label" for="event-offer-meal-1">
            <span class="event__offer-title">Add meal</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">15</span>
          </label>
        </div>

        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
          <label class="event__offer-label" for="event-offer-seats-1">
            <span class="event__offer-title">Choose seats</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">5</span>
          </label>
        </div>

        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
          <label class="event__offer-label" for="event-offer-train-1">
            <span class="event__offer-title">Travel by train</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">40</span>
          </label>
        </div>
*/
export default class EditForm extends SmartView {
  constructor(data, offersData) {
    super();
    //this._data = data;
    this._pointState = EditForm.parseDataToState(data);
    this._offersData = offersData;
    this._datePickerBeginDate = null;
    this._datePickerEndDate = null;
    this._element = null;

    this._editClickHandler = this._editClickHandler.bind(this);

    this._submitForm = this._submitForm.bind(this);

    this._onPointTypeChange = this._onPointTypeChange.bind(this);

    this._onPointDestinationInput = this._onPointDestinationInput.bind(this);
    this._onDateBeginChange = this._onDateBeginChange.bind(this);
    this._onDateEndChange = this._onDateEndChange.bind(this);
    this._setDatepicker(this._datePickerBeginDate, true);
    this._setDatepicker(this._datePickerEndDate);

  }

  getTemplate() {
    return creatEeditFormTemplate(this._pointState, this._offersData);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  _submitForm(evt) {
    evt.preventDefault();
    this._callback.editSubmit(EditForm.parseStateToData(this._pointState));
  }

  setSubmitForm(callback) {
    this._callback.editSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._submitForm);
  }

  _onPointTypeChange(evt) {
    evt.preventDefault();
    this._callback.pointTypeChange();
    this.updateData({
      type : evt.target.value,
    });
    console.log(this._pointState);
  }

  pointTypeChange(callback) {
    this._callback.pointTypeChange = callback;
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._onPointTypeChange);
  }

  //Обработка ввода города !при сохранении удалить флаг justEdit
  _onPointDestinationInput(evt) {

    this.updateData({
      destination: evt.target.value,
      description: '',

    });

    if (!DESTINATIONS.includes(evt.target.value)) {
      return this.updateData({
        destination: evt.target.value,
        description: '',
        justEdit: true,
      });
    }
    evt.preventDefault();
    this.updateData({
      destination: evt.target.value,
      description: destinDescripts[evt.target.value],
      justEdit: false,
    });

  }

  pointDestinationInput(callback) {
    this._callback.pointDestinationInput = callback;
    this.getElement().querySelector('.event__input--destination').addEventListener('input', this._onPointDestinationInput);
  }


  static parseDataToState(data) {
    return Object.assign(
      {},
      data,
      {
        justEdit: false,
      },
    );
  }

  static parseStateToData(state) {
    state =  Object.assign(
      {},
      state,
    );
    delete state.justEdit;
    return state;
  }

  resetInput(data) {
    this.updateData(EditForm.parseDataToState(data));
  }

  _restoreHandlers() {
    this.setEditClickHandler(this._callback.editClick);
    this.setSubmitForm(this._callback.editSubmit);

    this.pointTypeChange(this._callback.pointTypeChange);
    this.pointDestinationInput(this._callback.pointDestinationInput);

    this._setDatepicker(this._datePickerBeginDate, true);
    this._setDatepicker(this._datePickerEndDate);
  }

  _setDatepicker(datePicker, flag) {
    if (datePicker) {
      // В случае обновления компонента удаляем вспомогательные DOM-элементы,
      // которые создает flatpickr при инициализации
      datePicker.destroy();
      datePicker = null;
    }

    if (flag) {
      // flatpickr есть смысл инициализировать только в случае,
      // если поле выбора даты доступно для заполнения
      datePicker = flatpickr(
        this.getElement().querySelector('[name="event-start-time"]'),
        {
          dateFormat: 'd/m/y H:i',
          defaultDate: this._pointState.begin,
          onChange: this._onDateBeginChange, // На событие flatpickr передаём наш колбэк
        },
      );
      return;
    }

    datePicker = flatpickr(
      this.getElement().querySelector('[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._pointState.end,
        onChange: this._onDateEndChange, // На событие flatpickr передаём наш колбэк
      },
    );
  }

  _onDateBeginChange(newSelectedDate) {
    if (!compareTwoDates(newSelectedDate, this._pointState.end)) {
      this.updateData({
        begin: newSelectedDate[0],
        end: newSelectedDate[0],
      });
    }

    this.updateData({
      begin: newSelectedDate[0],
    });
  }

  _onDateEndChange(newSelectedDate) {
    if (!compareTwoDates(this._pointState.begin, newSelectedDate)) {
      newSelectedDate = this._pointState.begin;
    }

    this.updateData({
      end: newSelectedDate,
    });
  }
}

