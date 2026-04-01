export interface FuelReading {
  id:           number;
  truckId:      number;
  plateNumber:  string;
  tripId:       number;
  time:         string;
  fuelLevelL:   number;
  fuelRateLph:  number;
}