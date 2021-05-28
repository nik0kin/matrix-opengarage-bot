import { getStatusString } from './message-formatter';

describe('it', () => {
  test('should work', () => {
    const result = getStatusString({ dist: 135, door: 0, vehicle: 1, rcnt: 2 });
    expect(result).toEqual(
      `OpenGarage Status:
  - Closed
  - Vehicle Detected
  - Distance: 135 cm
`
    );
  });
});
