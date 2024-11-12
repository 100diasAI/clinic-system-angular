import { Routes } from '@angular/router';
import { HomepageComponent } from './features/homepage/pages/homepage/homepage.component';
import { LoginComponent } from './features/auth/login/pages/login.component';
import { PathConstants } from './core/constants/path.constants';
import { RegistrationComponent } from './features/auth/registration/pages/registration.component';
import { ManageUsersPageComponent } from './features/manage-users/pages/manage-users-page/manage-users-page.component';
import { authGuard } from './core/authentication/auth.guard';
import { UserRole } from './core/enums/UserRole';
import { DoctorsComponent } from './features/doctors/pages/doctors/doctors.component';
import { DoctorDetailsComponent } from './features/doctors/pages/doctor-details/doctor-details.component';
import { ManageAppointmentsComponent } from './features/manage-appoinments/pages/manage-appointments.component';
import { MyAppointmentsComponent } from './features/my-appointments/pages/my-appointments.component';
import { ManageSpecialtiesPageComponent } from './features/manage-specialties/pages/manage-specialties-page/manage-specialties-page.component';
import { ManageDoctorsPageComponent } from './features/manage-doctors/pages/manage-doctor-page/manage-doctor-page.component';
import { ManageSchedulesPageComponent } from './features/manage-schedules/pages/manage-schedules-page/manage-schedules-page.component';
import { BitacoraComponent } from './features/bitacora/bitacora.component';
//import { ManageRolesComponent } from './features/manage-roles/manage-roles.component';
//import { ManagePatientsComponent } from './features/manage-patients/pages/manage-users-page/manage-patients.component';

export const routes: Routes = [
  { path: PathConstants.HOME_PATH, component: HomepageComponent },
  { path: PathConstants.LOGIN_PATH, component: LoginComponent },
  { path: PathConstants.REGISTER_PATH, component: RegistrationComponent },
  { path: PathConstants.DOCTORS_PATH, component: DoctorsComponent },
  {
    path: PathConstants.DOCTOR_DETAILS_PATH,
    component: DoctorDetailsComponent,
  },

  //Secured routes
  {
    path: PathConstants.MY_APPOINTMENTS_PATH,
    component: MyAppointmentsComponent,
    canActivate: [authGuard],
  },
  {
    path: PathConstants.MANAGE_USERS_PATH,
    component: ManageUsersPageComponent,
    canActivate: [authGuard],
    data: {
      expectedRoles: <UserRole[]>[
        UserRole.ADMIN,
        UserRole.DOCTOR,
        UserRole.REGISTRAR,
      ],
    },
  },
  {
    path: PathConstants.MANAGE_APPOINTMENTS_PATH,
    component: ManageAppointmentsComponent,
    canActivate: [authGuard],
    data: {
      expectedRoles: <UserRole[]>[UserRole.DOCTOR, UserRole.REGISTRAR],
    },
  },
  {
    path: PathConstants.MANAGE_SPECIALTIES_PATH,
    component: ManageSpecialtiesPageComponent,
    canActivate: [authGuard],
    data: {
      expectedRoles: <UserRole[]>[UserRole.ADMIN],
    },
  },
  {
    path: PathConstants.MANAGE_DOCTORS_PATH,
    component: ManageDoctorsPageComponent,
    canActivate: [authGuard],
    data: {
      expectedRoles: <UserRole[]>[UserRole.ADMIN, UserRole.REGISTRAR],
    },
  },
  {
    path: PathConstants.MANAGE_BITACORA_PATH,
    component: BitacoraComponent,
    canActivate: [authGuard],
    data: {
      expectedRoles: <UserRole[]>[UserRole.ADMIN, UserRole.REGISTRAR],
    },
  },
/*   {
    path: PathConstants.MANAGE_SCHEDULES_PATH,
    component: ManageSchedulesPageComponent,
    canActivate: [authGuard],
    data: {
      expectedRoles: <UserRole[]>[UserRole.ADMIN, UserRole.DOCTOR],
    },
    
  },
  {
    path: PathConstants.MANAGE_ROLES_PATH,
    component: ManageRolesComponent,
    canActivate: [authGuard],
    data: {
      expectedRoles: <UserRole[]>[UserRole.ADMIN],
    },
  },
  {
    path: PathConstants.MANAGE_PATIENTS_PATH,
    component: ManagePatientsComponent,
    canActivate: [authGuard],
    data: {
      expectedRoles: <UserRole[]>[UserRole.ADMIN, UserRole.REGISTRAR],
    },
  }, */

  { path: '**', redirectTo: '' },
];
