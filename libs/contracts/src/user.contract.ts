/** A saved shipping / billing address for a user. */
export interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

/** The canonical contract for a user shared across services. */
export interface UserContract {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  roles: string[];
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}
