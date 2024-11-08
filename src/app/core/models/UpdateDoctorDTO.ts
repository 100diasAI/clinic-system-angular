export interface UpdateDoctorDTO {
  name?: string;
  surname?: string;
  email?: string;
  phoneNumber?: string;
  pesel?: string;
  specialties?: string[];
  address?: {
    country?: string;
    city?: string;
    street?: string;
    postalCode?: string;
    houseNumber?: string;
    apartmentNumber?: string;
  };
  isEnabled?: boolean;
  doctorDetails?: {
    specialization?: string;
    education?: string;
    description?: string;
  };
} 