const MILLISEC_IN_MINUTE = 60000;

export const formatDuration = (duration) => {
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

export const getTypePrices = (points, types) => {

  const pricesPerType = new Array(types.length).fill(0);
  const typeCount = new Array(types.length).fill(0);
  const durationPerType = new Array(types.length).fill(0);


  const typesToLowrerCase = types.slice();
  for (let i = 0; i < typesToLowrerCase.length; i++) {
    typesToLowrerCase[i] = typesToLowrerCase[i].toLowerCase();
  }

  points.forEach((point) => {
    const duration = (point.end - point.begin) / MILLISEC_IN_MINUTE;

    pricesPerType[typesToLowrerCase.indexOf(point.type)] = pricesPerType[typesToLowrerCase.indexOf(point.type)] + point.price;
    typeCount[typesToLowrerCase.indexOf(point.type)] = typeCount[typesToLowrerCase.indexOf(point.type)] + 1;
    durationPerType[typesToLowrerCase.indexOf(point.type)] = durationPerType[typesToLowrerCase.indexOf(point.type)] + duration;

  });

  const formattedDuration = new Array(types.length).fill(0);
  durationPerType.forEach((duration, i) => {

    if (duration < 60) {
      duration = `${duration.toString().padStart(2, '0')}M`;
    }
    if (duration >= 60 && duration < 1440) {
      duration = `${Math.floor(duration/60).toString().padStart(2, '0')}H ${(duration % 60).toString().padStart(2, '0')}M`;
    }
    if (duration > 1440) {
      duration = `${Math.floor(duration/1440).toString().padStart(2, '0')}D ${Math.floor((duration % 1440)/60).toString().padStart(2, '0')}H ${(duration % 60).toString().padStart(2, '0')}M`;
    }
    formattedDuration[i] = duration;

  });

//  console.log(formattedDuration);
  const stats = {
    price: pricesPerType,
    type: typeCount,
    time: durationPerType,
    timeFormatted: formattedDuration,
  };

//  console.log(stats);
  return stats;
};
