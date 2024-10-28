export interface createDoctor {
    readonly id: string;
    name: string;
    surname: string;
    email: string;
    specialties: string[];
    phoneNumber: string;
    pesel: string;
    address: {
      country: string;
      city: string;
      street: string;
      postalCode: string;
      houseNumber: string;
      apartmentNumber?: string;
    };
    isEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
  }