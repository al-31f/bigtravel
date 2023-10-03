import Observer from '../utils/observer.js';

export default class OffersIndex extends Observer {
  constructor() {
    super();
    this._offersIndex = [];
    this._offersDescriptions ={};
  }

  setOffers(updateType, offersIndex) {
    this._offersIndex = offersIndex.slice();

    this._notify(updateType);
  }

  getOffers() {
    return this._offersIndex;
  }

  getOffersDescriptions() {
    this._offersIndex.forEach((offer) => {
      this._offersDescriptions[offer.type] = offer.offers;
    });
    return this._offersDescriptions;
  }

}
