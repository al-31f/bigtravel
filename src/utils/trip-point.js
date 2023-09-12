import dayjs from 'dayjs';


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
