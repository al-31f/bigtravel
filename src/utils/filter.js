import {FilterType} from '../consts.js';
import { isFuturePoint ,isPastPoint} from '../utils/trip-point.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.slice(),
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.begin)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPoint(point.end)),
};
