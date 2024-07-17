export interface ILocation {
  coordinates: [number, number];
  crs: {
    properties: {
      name: string;
    };
    type: string;
  };
  type: string;
}
