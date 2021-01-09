export interface Address {
  city: string;
  country: string;
  street: string;
  zip: string;
}

export interface Customer {
  email: string;
  name: string;
  phone: string;
}

export type OrderDto = {
  id: string;
  address: Address;
  bookingDate: number;
  customer: Customer;
  title: string;
  uid: string;
};
