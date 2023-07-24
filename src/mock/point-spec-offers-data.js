import { pointsData } from '../main.js';

/*
{
  type: flight,
    options: [
     {
       title: Add luggage,
       prise: 15,
       checked: false,
     },

     {
       title: Add luggage,
       prise: 15,
       checked: false,
     },
  ]
}
Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant
const defaultOffers = [
  {

  }
]

*/
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const genSpecOffersData = () => {

  const OFFER_TITLES = {
    'flight': ['Add luggage', 'Switch to comfort', 'Add meal', 'Choose seats', 'Travel by train'],
    'drive': ['Rent a car'],
    'check-in': ['Early check-in', 'Add breakfast'],
  };
  // ['Add luggage', 'Switch to comfort', 'Add meal', 'Choose seats', 'Travel by train'];
  //console.log(OFFER_TITLES[pointData.type].length);
  const specOffersData = [];
  for (let i = 0; i < 20; i++) {
    //console.log(pointsData[i].type);
    if (OFFER_TITLES[pointsData[i].type] === undefined) {
      //console.log
    } else {
      //console.log(pointsData[i].type);
      for (let j = 0; j <= getRandomInt(0 , OFFER_TITLES[pointsData[i].type].length-1); j++) {
        const specOfferData = {
          id: `${pointsData[i].id.toString()}${j.toString()}`,
          type: pointsData[i].type,
          title: OFFER_TITLES[pointsData[i].type][getRandomInt(0, OFFER_TITLES[pointsData[i].type].length-1)],
          price: getRandomInt(3, 40),
        };
        pointsData[i].offers.push(specOfferData.id);
        specOffersData.push(specOfferData);
      }
    }
  }
  // console.log(specOffersData);
  return specOffersData;
};

