import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

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
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const PointDataDefault = {
  id: nanoid(),
  type: 'taxi',
  destination: '',
  begin: dayjs().toDate(),
  end: dayjs().toDate(),
  duration: 0,
  price: 0,
  description: '',
  images: '',
  favorite: false,
  offers: [],
};
