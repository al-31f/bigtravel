import {createElement} from '../utils.js';

const calculateTripCost = (data, features) => {

  let tripCost = 0;
  for (let i = 0; i < data.length; i++) {
    tripCost = tripCost + data[i].price;
  }
  for (let i = 0; i < features.length; i++) {
    tripCost = tripCost + features[i].price;
  }
  return tripCost;
};

const createTripCostTemplate = (data, features) => `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculateTripCost(data, features)}</span>
</p>`;

export default class TripCost {
  constructor(data, features) {
    this._data = data;
    this.features = features;
    this._element = null;
  }

  getTemplate() {
    return createTripCostTemplate(this._data, this.features);
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

