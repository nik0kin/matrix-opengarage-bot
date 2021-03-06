export const PUB_OUT_NOTIFY = '/OUT/NOTIFY';
export const PUB_OUT_JSON = '/OUT/JSON';
export const SUB_IN_STATE = '/IN/STATE';

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

export type STATE_CHANGE = 'click' | 'open' | 'close';
