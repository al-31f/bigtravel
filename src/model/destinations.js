import Observer from '../utils/observer.js';

export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
    this._destinationsDescriptions = {};
    this._destinationsList = [];
  }

  setDestinations(updateType, destinations) {
    this._destinations = destinations.slice();

    this._notify(updateType);
  }

  getDestinations() {
    return this._destinations;
  }

  getDestinationsDescriptions() {
    this._destinations.forEach((destination) => {
      this._destinationsDescriptions[destination.name] = destination.description;
    });
    return this._destinationsDescriptions;
  }

  getDestinationsList() {
    this._destinations.forEach((destination) => {
      this._destinationsList.push(destination.name);
    });
    return this._destinationsList;
  }
}
