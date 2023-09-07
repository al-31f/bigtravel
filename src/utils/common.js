export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const convertDuration = (duration) => {

  if (duration < 60) {
    duration = `${duration.toString().padStart(2, '0')}M`;
  }
  if (duration >= 60 && duration < 1440) {
    duration = `${Math.floor(duration/60).toString().padStart(2, '0')}H ${(duration % 60).toString().padStart(2, '0')}M`;
  }
  if (duration >1440) {
    duration = `${Math.floor(duration/1440).toString().padStart(2, '0')}D ${Math.floor((duration % 1440)/60).toString().padStart(2, '0')}H ${(duration % 60).toString().padStart(2, '0')}M`;
  }
  return duration;
};
