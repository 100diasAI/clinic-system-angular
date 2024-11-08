export interface CreateDoctorDTO {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  education?: string;
  description?: string;
  isEnabled: boolean;
}
