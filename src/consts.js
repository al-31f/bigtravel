import dayjs from 'dayjs';

export const MILLISEC_IN_MINUTE = 60000;

export const POINT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];


export const SortType = {
  DEFAULT: 'default',
  TIME_DOWN: 'time-down',
  PRICE_DOWN: 'price-down',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const PointDataDefault = {
  type: 'taxi',
  destination: '',
  begin: dayjs().toDate(),
  end: dayjs().toDate(),
  duration: 0,
  price: 0,
  description: '',
  images: [{src: 'http://picsum.photos/300/200?r=0.11985047947328398', description: 'Geneva biggest supermarket'}],
  favorite: false,
  offers: [],
};
