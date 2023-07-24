import dayjs from 'dayjs';
import AbstractView from './abstract.js';

const renderOffer = (offers, point) => {
  let oferrsArray = [];
  let pointOffers = '';
  if (point.offers.length > 0) {
    //console.log(point.offers);
    for (let i = 0; i < point.offers.length; i++ ) {
      oferrsArray = oferrsArray.concat(offers.filter((offer) => offer.id.toString() === point.offers[i].toString()));

    }
    //console.log(offers.filter((offer) => offer.id.toString() === point.offers[0].toString()));
    //console.log(oferrsArray);
    //console.log(point.offers[0]);
  }
  for (let j = 0; j < oferrsArray.length; j++) {
    const singlOffer = ` <li class="event__offer">
    <span class="event__offer-title">${oferrsArray[j].title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${oferrsArray[j].price}</span>
  </li>`;
    pointOffers = pointOffers + singlOffer;
  }
  return pointOffers;
};

const favorite = (data) => data.favorite === 'true' ? 'event__favorite-btn--active' : '';


const createTripPointTemplate = (data, specOffersData) => `<li class="trip-events__item">
<div class="event">
  <time class="event__date" datetime="2019-03-18">${dayjs(data.begin).format('MMM DD')}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${data.type}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${data.type} ${data.destination}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${dayjs(data.begin).format('YYYY-MM-DDTHH:mm')}">${dayjs(data.begin).format('HH:mm')}</time>
      &mdash;
      <time class="event__end-time" datetime="${dayjs(data.end).format('YYYY-MM-DDTHH:mm')}">${dayjs(data.end).format('HH:mm')}</time>
    </p>
    <p class="event__duration">${data.duration}</p>
  </div>
  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${data.price}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
  ${renderOffer(specOffersData, data)}
  </ul>
  <button class="event__favorite-btn ${favorite(data)} " type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>
</li>`;


export default class TripPoint extends AbstractView {
  constructor(data, features) {
    super();
    this._data = data;
    this.features = features;
    this._element = null;

    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createTripPointTemplate(this._data, this.features);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }
}
