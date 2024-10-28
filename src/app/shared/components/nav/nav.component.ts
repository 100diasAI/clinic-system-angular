import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '@app/core/authentication/auth.service';
import { PathConstants } from '@app/core/constants/path.constants';
import { UserRole } from '@app/core/enums/UserRole';
import { NavItemComponent } from './nav-item/nav-item.component';
import { MatLine } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';

interface NavItem {
  listItemText: string;
  listItemPath: string;
  allowedRoles?: UserRole[];
  requireLogin: boolean;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    NgTemplateOutlet,
    RouterLinkActive,
    RouterLink,
    MatListItem,
    MatNavList,
    MatToolbar,
    MatIcon,
    AsyncPipe,
    NavItemComponent,
    MatToolbarModule,
    MatLine,
    MatExpansionModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  navItems: NavItem[] = [
    {
      listItemText: 'Inicio',
      listItemPath: PathConstants.HOME_PATH,
      requireLogin: false,
    },
    {
      listItemText: 'Doctores',
      listItemPath: PathConstants.DOCTORS_PATH,
      requireLogin: false,
    },
    {
      listItemText: 'Mis citas',
      listItemPath: PathConstants.MY_APPOINTMENTS_PATH,
      requireLogin: true,
    },
    {
      listItemText: 'Gestionar Usuarios',
      listItemPath: PathConstants.MANAGE_USERS_PATH,
      requireLogin: true,
      allowedRoles: [UserRole.ADMIN, UserRole.DOCTOR],
    },
    {
      listItemText: 'Gestionar Citas',
      listItemPath: `manage-appointments/${this.authService.authDataValue?.id}`,
      requireLogin: true,
      allowedRoles: [UserRole.DOCTOR],
    },
  ];

  adminNavItems: NavItem[] = [
    { 
      listItemText: 'Gestión de Especialidades Médicas', 
      listItemPath: PathConstants.MANAGE_SPECIALTIES_PATH,
      requireLogin: true,
      allowedRoles: [UserRole.ADMIN]
    },
    { 
      listItemText: 'Gestión de Médicos', 
      listItemPath: PathConstants.MANAGE_DOCTORS_PATH,
      requireLogin: true,
      allowedRoles: [UserRole.ADMIN]
    },
    { 
      listItemText: 'Gestión de Horarios de Atención', 
      listItemPath: PathConstants.MANAGE_SCHEDULES_PATH,
      requireLogin: true,
      allowedRoles: [UserRole.ADMIN]
    },
    { 
      listItemText: 'Gestión de Asegurados', 
      listItemPath: PathConstants.MANAGE_PATIENTS_PATH,
      requireLogin: true,
      allowedRoles: [UserRole.ADMIN]
    },
  ];

  protected readonly PathConstants = PathConstants;
  protected readonly UserRole = UserRole;

  constructor(protected readonly authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
