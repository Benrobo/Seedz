export interface CreateUserType {
  id: string;
  email: string;
  fullname: string;
  username: string;
  role: "MERCHANT" | "SUPPLIER" | "BUYER";
  profileImage: string;
}
