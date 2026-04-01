export interface Trip {
  id:                 number;
  truckId:            number;
  plateNumber:        string;
  driverId:           number;
  driverName:         string;
  origin:             string;
  destination:        string;
  startedAt:          string;
  endedAt:            string;
  distanceKm:         number;
  fuelUsedL:          number;
  avgSpeedKmh:        number;
  fuelEfficiencyKmL:  number;
  status:             TripStatus;
}

export enum TripStatus {
  ONGOING   = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}