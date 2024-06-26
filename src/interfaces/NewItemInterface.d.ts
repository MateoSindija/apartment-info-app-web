import { IFirebaseTimestamp } from "./MessagesInterface";

export interface INewBasicWithPostion {
  title: string;
  lat: number;
  lng: number;
  description: string;
  imagesUrl?: string[];
  titleImage?: string | number;
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
  titleImage?: string | number;
  id?: string;
}

export interface IReview {
  review: string;
  timestamp: IFirebaseTimestamp;
  id: string;
  comfortRating: number;
  experienceRating: number;
  valueRating: number;
}

export type PossibleInterfaces =
  | INewBeach
  | INewRestaurant
  | INewBasicWithPostion
  | INewDevice;
