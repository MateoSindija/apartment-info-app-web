import { ILocation } from "@/interfaces/LocationInterface";

export interface IApartment {
  apartmentId: string;
  ownerId: string;
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  apartmentPassword: string;
  location: ILocation;
}

export interface IApartmentInfo {
  address: string;
  apartmentId: string;
  location: ILocation;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  apartmentPassword: string;
}

export interface INewApartment {
  name: string;
  address: string;
  lat: number;
  lng: number;
  apartmentPassword: string;
}
