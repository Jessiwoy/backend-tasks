export interface User {
  email: string;
  picture: string;
  name: string;
}

export interface BaseUser {
  name: string;
}

export interface Contact {
  phone_number: string;
  email: string;
}

export interface SecretInfo {
  password: string;
}
export interface Picture {
  id: string;
}

export interface UserModel extends BaseUser, Contact, SecretInfo {
  picture: Picture;
}
