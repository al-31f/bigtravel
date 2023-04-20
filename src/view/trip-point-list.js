import {createElement} from '../utils.js';

const createTripPointListTemplate = () => `<ul class="trip-events__list">

</ul>`;


export default class TripPointList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripPointListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
