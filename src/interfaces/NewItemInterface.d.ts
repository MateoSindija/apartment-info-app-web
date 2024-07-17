import { IFirebaseTimestamp } from "./MessagesInterface";
import { ILocation } from "@/interfaces/LocationInterface";

export interface INewBasicWithPostion {
  title: string;
  lat: number;
  lng: number;
  description: string;
  imagesUrl?: string[];
  titleImage?: string | number;
}
export interface IBasic {
  title: string;
  description: string;
  imagesUrl: string[];
  titleImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface INewBeach extends INewBasicWithPostion {
  terrainType: string;
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
  titleImage: string | number;
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

export interface IRestaurant extends IBasic {
  emailContact: string;
  phoneContact: string;
  restaurantId: string;
  review: number;
  reviewAmount: number;
  location: ILocation;
}

export interface IBeach extends IBasic {
  terrainType: string;
  beachId: string;
  location: ILocation;
}
export interface IDevice extends IBasic {
  deviceId: string;
}
export interface IShop extends IBasic {
  shopId: string;
  location: ILocation;
}
export interface ISight extends IBasic {
  sightId: string;
  location: ILocation;
}

export type PossibleInterfaces =
  | INewBeach
  | INewRestaurant
  | INewBasicWithPostion
  | INewDevice;
