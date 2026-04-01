export interface Alert {
  id:          number;
  truckId:     number;
  plateNumber: string;
  tripId:      number;
  type:        AlertType;
  severity:    AlertSeverity;
  message:     string;
  latitude:    number;
  longitude:   number;
  isRead:      boolean;
  triggeredAt: string;
}

export enum AlertType {
  SPEEDING      = 'SPEEDING',
  GEOFENCE      = 'GEOFENCE',
  FUEL_DROP     = 'FUEL_DROP',
  IDLE          = 'IDLE',
  OFFLINE       = 'OFFLINE',
  HARSH_BRAKING = 'HARSH_BRAKING',
  ACCELERATION  = 'ACCELERATION'
}

export enum AlertSeverity {
  LOW      = 'LOW',
  MEDIUM   = 'MEDIUM',
  HIGH     = 'HIGH',
  CRITICAL = 'CRITICAL'
}