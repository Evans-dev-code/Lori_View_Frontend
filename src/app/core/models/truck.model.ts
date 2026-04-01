export interface Truck {
  id:               number;
  ownerId:          number;
  plateNumber:      string;
  make:             string;
  model:            string;
  year:             number;
  fuelCapacityL:    number;
  deviceImei:       string;
  status:           TruckStatus;
  createdAt:        string;
  currentFuelLevel?: number;
  currentSpeedKmh?:  number;
  lastLatitude?:     number;
  lastLongitude?:    number;
}

export enum TruckStatus {
  ACTIVE      = 'ACTIVE',
  INACTIVE    = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE'
}