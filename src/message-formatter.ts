import { ControllerParameters, DOOR, VEHICLE } from './mygarage';

export function getStatusString(statusJSON: ControllerParameters) {
  return `OpenGarage Status:
  - ${statusJSON.door === DOOR.OPEN ? 'Open' : 'Closed'}
${statusJSON.vehicle === VEHICLE.DETECTED ? '  - Vehicle Detected' : ''}
  - Distance: ${statusJSON.dist} cm
`;
}
