import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateDate = () => {

  const maxDaysGap = 7;
  const daysGap = getRandomInt(-maxDaysGap, maxDaysGap);
  const dateBegin = dayjs().add(daysGap, 'day').add(daysGap, 'minute').add(daysGap, 'hour');
  let duration = getRandomInt(0 , 3000);
  const dateEnd = dateBegin.add(duration, 'minute');
  if (duration < 60) {
    duration = `${duration.toString().padStart(2, '0')}M`;
  }
  if (duration >= 60 && duration < 1440) {
    duration = `${Math.floor(duration/60).toString().padStart(2, '0')}H ${(duration % 60).toString().padStart(2, '0')}M`;
  }
  if (duration >1440) {
    duration = `${Math.floor(duration/1440).toString().padStart(2, '0')}D ${Math.floor((duration % 1440)/60).toString().padStart(2, '0')}H ${(duration % 60).toString().padStart(2, '0')}M`;
  }
  return [dateBegin.toDate(), dateEnd.toDate(), duration];
};

const isFavorite = () => getRandomInt(0, 1) === 1 ? 'true' : 'false';
export const genPointData = () => {
  const POINT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
  const DESTINATIONS = ['Istanbul', 'Barcelona', 'Porto', 'Santiago', 'Bordo', 'Paris', 'Praha'];
  const DESCRIPTIONS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. ',
    'Fusce tristique felis at fermentum pharetra. ',
    'Aliquam id orci ut lectus varius viverra. ',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
    'Sed sed nisi sed augue convallis suscipit in sed felis. ',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. ',
    'In rutrum ac purus sit amet tempus. '];
  const dates = generateDate();

  const genDescription = () => {
    let description = '';
    for (let i = 0; i < getRandomInt(1, 5); i++) {
      description = description + DESCRIPTIONS[getRandomInt(0, DESCRIPTIONS.length-1)];
    }
    return description;
  };

  const genImages = () => {
    const images = [];
    for (let i = 0; i < getRandomInt(1,5); i++) {
      images.push(`http://picsum.photos/248/152?r=${getRandomInt(1,700)}`);
    }
    return images;
  };

  const pointData = {
    id: 0,
    type: POINT_TYPES[getRandomInt(0, POINT_TYPES.length - 1)].toLocaleLowerCase(),
    destination: DESTINATIONS[getRandomInt(0, DESTINATIONS.length - 1)],
    begin: dates[0],
    end: dates[1],
    duration: dates[2],
    price: getRandomInt(5 , 200),
    description: genDescription(),
    imsges: genImages(),
    favorite: isFavorite(),
    offers: [],
  };
  return pointData;
};

export const genPointsData = () => {
  const pointsData = [];
  for (let i = 0 ; i <20 ; i++) {
    pointsData.push(genPointData());
    pointsData[i].id = i;
  }
  return pointsData;
};
