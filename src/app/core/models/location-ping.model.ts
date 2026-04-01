export interface LocationPing {
  truckId:     number;
  plateNumber: string;
  tripId:      number;
  time:        string;
  latitude:    number;
  longitude:   number;
  speedKmh:    number;
  headingDeg:  number;
  altitudeM:   number;
  satellites:  number;
}

export interface LiveTruck {
  truckId:            number;
  plateNumber:        string;
  make:               string;
  model:              string;
  status:             string;
  latitude:           number;
  longitude:          number;
  speedKmh:           number;
  headingDeg:         number;
  lastSeen:           string;
  fuelLevelL:         number;
  fuelCapacityL:      number;
  fuelPercentage:     number;
  currentTripId:      number;
  currentDestination: string;
}