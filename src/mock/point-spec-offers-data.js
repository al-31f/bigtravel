import { pointsData } from '../main.js';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const OFFER_TITLES = {
  'flight': ['Add luggage', 'Switch to comfort', 'Add meal', 'Choose seats', 'Travel by train'],
  'drive': ['Rent a car'],
  'check-in': ['Early check-in', 'Add breakfast'],
  'taxi':['Tips', 'Comfort'],
  'bus':['First seat', 'Drink'],
  'train' : ['Coffe', 'Snack'],
  'ship' : ['Life vest', 'Dinner'],
  'transport' : ['Booking in advance'],
  'sightseeing' : ['Guide', 'Postcard'],
  'restaurant' : ['Tips', 'Private space'],
};
const genOffersPrices = () => {
  const OFFER_PRICES = {
    'flight': [getRandomInt(3, 40), getRandomInt(3, 40), getRandomInt(3, 40), getRandomInt(3, 40), getRandomInt(3, 40)],
    'drive': [getRandomInt(3, 40)],
    'check-in': [getRandomInt(3, 40), getRandomInt(3, 40)],
    'taxi':[getRandomInt(3, 40), getRandomInt(3, 40)],
    'bus':[getRandomInt(3, 40), getRandomInt(3, 40)],
    'train' : [getRandomInt(3, 40), getRandomInt(3, 40)],
    'ship' : [getRandomInt(3, 40), getRandomInt(3, 40)],
    'transport' : [getRandomInt(3, 40)],
    'sightseeing' : [getRandomInt(3, 40), getRandomInt(3, 40)],
    'restaurant' : [getRandomInt(3, 40), getRandomInt(3, 40)],
  };
  return OFFER_PRICES;
};

export const REAL_OFFER_PRICES = genOffersPrices();

export const genSpecOffersData = () => {

  // Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'
  //['Add luggage', 'Switch to comfort', 'Add meal', 'Choose seats', 'Travel by train'];
  const specOffersData = [];
  for (let i = 0; i < 20; i++) {
    //console.log(pointsData[i].type);
    if (OFFER_TITLES[pointsData[i].type] === undefined) {
      //console.log
    } else {
      //console.log(pointsData[i].type);
      for (let j = 0; j < getRandomInt(0 , OFFER_TITLES[pointsData[i].type].length-1); j++) {
        const pointType = pointsData[i].type;
        const pointTitle = OFFER_TITLES[pointsData[i].type][getRandomInt(0, OFFER_TITLES[pointsData[i].type].length-1)];
        const indexOfOffer = OFFER_TITLES[pointType].indexOf(pointTitle);
        const specOfferData = {
          id: `${pointsData[i].id.toString()}${j.toString()}`,
          type: pointType,
          title: pointTitle,
          price: REAL_OFFER_PRICES[pointType][indexOfOffer],
          //price: getRandomInt(3, 40),
        };
        pointsData[i].offers.push(specOfferData.id);
        specOffersData.push(specOfferData);
      }
    }
  }
  // console.log(specOffersData);
  return specOffersData;
};

