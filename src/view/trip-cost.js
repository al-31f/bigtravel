const calculateTripCost = (data, features) => {

  let tripCost = 0;
  for (let i = 0; i < data.length; i++) {
    tripCost = tripCost + data[i].price;
  }
  for (let i = 0; i < features.length; i++) {
    tripCost = tripCost + features[i].price;
  }
  return tripCost;
};

export const tripCostTemplate = (data, features) => `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculateTripCost(data, features)}</span>
</p>`;
