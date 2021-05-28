export const PUB_OUT_JSON = '/OUT/JSON';

export enum DOOR {
  CLOSED = 0,
  OPEN = 1,
}

export enum VEHICLE {
  NOT_DETECTED = 0,
  DETECTED = 1,
  UNKNOWN = 2,
}

export interface ControllerParameters {
  dist: number; // distance in cm
  door: DOOR;
  vehicle: VEHICLE;
  rcnt: number; // read count
}
