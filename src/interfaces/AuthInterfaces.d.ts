export interface ISignIn {
  email: string;
  password: string;
}
export interface IUserInfo {
  firstName: string;
  lastName: string;
  userID: string;
  email: string;
  emailVerified: boolean;
  verificationCode: string;
}

export interface IUserState {
  id: string | undefined;
  type: string | undefined;
  token: string | undefined;
  apartmentId: string | undefined;
}
