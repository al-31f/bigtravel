import dayjs from 'dayjs';
import { MILLISEC_IN_MINUTE } from '../consts';

// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortTaskUp = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  if (weight !== null) {
    return weight;
  }

  return dayjs(taskA.dueDate).diff(dayjs(taskB.dueDate));
};

export const sortTaskDown = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.begin, taskB.begin);

  if (weight !== null) {
    return weight;
  }

  return dayjs(taskB.begin).diff(dayjs(taskA.begin));
};

export const comparePrice = (pointA, pointB) => {
  const pointPriceA = pointA.price;
  const pointPriceB = pointB.price;
  return pointPriceB - pointPriceA;
};

export const compareDuration = (pointA, pointB) => {
  const pointDurationA = pointA.end - pointA.begin;
  const pointDurationB = pointB.end - pointB.begin;
  return pointDurationB - pointDurationA;
};

export const compareTwoDates = (dateBegin, dateEnd) => {
  if (dayjs(dateEnd) > dayjs(dateBegin)) {
    return true;
  }
  else {
    return false;
  }
};

export const isPastPoint = (dateBegin) => {
  if (dayjs().isAfter(dateBegin, 'D') > 0) {
    return true;
  }
  else {
    return false;
  }
};

export const isFuturePoint = (dateEnd) => {
  if (dayjs().isBefore(dateEnd, 'D') > 0) {
    return true;
  }
  else {
    return false;
  }
};


export const formatDuration = (start, end) => {
  let duration = (end - start) / MILLISEC_IN_MINUTE;

  if (duration < 60) {
    duration = `${duration.toString().padStart(2, '0')}M`;
  }
  if (duration >= 60 && duration < 1440) {
    duration = `${Math.floor(duration/60).toString().padStart(2, '0')}H ${(duration % 60).toString().padStart(2, '0')}M`;
  }
  if (duration > 1440) {
    duration = `${Math.floor(duration/1440).toString().padStart(2, '0')}D ${Math.floor((duration % 1440)/60).toString().padStart(2, '0')}H ${(duration % 60).toString().padStart(2, '0')}M`;
  }
  return duration;
};
