import { UserFormValidationConstants } from './user-form-validation.constants';

interface ValidationMessage {
  [key: string]: { type: string; message: string }[];
}

export const Registration_Validation_Messages: ValidationMessage = {
  name: [
    { type: 'required', message: 'El nombre es obligatorio' },
    {
      type: 'minlength',
      message: `El nombre debe tener al menos ${UserFormValidationConstants.MIN_NAME_LENGTH} caracteres`,
    },
    {
      type: 'maxlength',
      message: `El nombre no puede tener más de ${UserFormValidationConstants.MAX_NAME_LENGTH} caracteres`,
    },
  ],
  surname: [
    { type: 'required', message: 'El apellido es obligatorio' },
    {
      type: 'minlength',
      message: `El apellido debe tener al menos ${UserFormValidationConstants.MIN_SURNAME_LENGTH} caracteres`,
    },
    {
      type: 'maxlength',
      message: `El apellido no puede tener más de ${UserFormValidationConstants.MAX_SURNAME_LENGTH} caracteres`,
    },
  ],
  phoneNumber: [
    {
      type: 'minlength',
      message: `El número de teléfono debe tener al menos ${UserFormValidationConstants.MIN_PHONE_NUMBER_LENGTH} caracteres`,
    },
    {
      type: 'maxlength',
      message: `El número de teléfono no puede tener más de ${UserFormValidationConstants.MAX_PHONE_NUMBER_LENGTH} caracteres`,
    },
  ],
  email: [
    { type: 'required', message: 'El correo electrónico es obligatorio' },
    { type: 'email', message: 'Ingrese un correo electrónico válido' },
  ],
  pesel: [
    { type: 'required', message: 'El CI es obligatorio' },
    {
      type: 'minlength',
      message: `El CI debe tener ${UserFormValidationConstants.PESEL_LENGTH} caracteres`,
    },
    {
      type: 'maxlength',
      message: `El CI debe tener ${UserFormValidationConstants.PESEL_LENGTH} caracteres`,
    },
  ],
  password: [
    { type: 'required', message: 'La contraseña es obligatoria' },
    {
      type: 'minlength',
      message: `La contraseña debe tener al menos ${UserFormValidationConstants.MIN_PASSWORD_LENGTH} caracteres`,
    },
    {
      type: 'maxlength',
      message: `La contraseña no puede tener más de ${UserFormValidationConstants.MAX_PASSWORD_LENGTH} caracteres`,
    },
  ],
  confirmPassword: [
    { type: 'required', message: 'Confirmar la contraseña es obligatorio' },
    { type: 'matching', message: 'Las contraseñas no coinciden' },
  ],
  country: [{ type: 'required', message: 'El país es obligatorio' }],
  city: [{ type: 'required', message: 'La ciudad es obligatoria' }],
  street: [{ type: 'required', message: 'La calle es obligatoria' }],
  postalCode: [{ type: 'required', message: 'El código postal es obligatorio' }],
  houseNumber: [{ type: 'required', message: 'El número de casa es obligatorio' }],
};
