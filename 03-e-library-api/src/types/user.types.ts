export interface IUser {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  password: string;
  createJWT(): string;
  comparePassword(password: string): boolean;
}
