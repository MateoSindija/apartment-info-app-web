export interface INewBasicWithPostion {
  title: string;
  lat: number;
  lng: number;
  imagesUrl?: string[];
  id?: string;
}

export interface INewBeach extends INewBasicWithPostion {
  terrainType: "sand" | "gravel";
  description: string;
}
export interface INewRestaurant extends INewBasicWithPostion {
  review: number;
  reviewAmount: number;
  description: string;
  contacts: {
    email: string;
    number: string;
  };
}

export interface INewDevice {
  title: string;
  description: string;
  imagesUrl?: string[];
  id?: string;
}

export interface IReview {
  rating: number;
  description: string;
  id: string;
}
