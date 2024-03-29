import Observer from '../utils/observer.js';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(updateType, offers) {
    this._offers = offers.slice();

    this._notify(updateType);
  }

  getOffers() {
    return this._offers;
  }

  static adaptToClient(points) {
    const adoptedPointOffers =[];

    points.forEach((point) => {
      point.offers.forEach((offer, index) => {
        adoptedPointOffers.push(Object.assign(
          {},
          offer,
          {
            type: point.type,
            id: point.id.toString() + (index*101).toString(),
          },
        ));

      });
    });

    return adoptedPointOffers;
  }
}
