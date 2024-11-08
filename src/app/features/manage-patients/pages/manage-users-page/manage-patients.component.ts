/* import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '@app/core/services/user.service';

import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { PageRequestResponseData } from '@app/shared/models/PageRequestResponseData';
import { User } from '@app/core/models/user/User';
import { CapitalizeSpaceBetweenPipe } from '@app/shared/pipes/capitalize-space-between.pipe';
import { TableHelper } from '@app/shared/helpers/tableHelper';
import { LastPropertyPipe } from '@app/shared/pipes/last-property.pipe';
import { PaginatorComponent } from '@app/shared/components/paginator/paginator.component';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { UserPageRequestParams } from '@app/shared/models/UserPageRequestParams';
import { DatePipe } from '@app/shared/pipes/date.pipe';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MatCheckbox } from '@angular/material/checkbox';
import { SpinnerService } from '@app/shared/spinner/spinner.service';
import { UserRole } from '@app/core/enums/UserRole';
import { UserFormComponent } from '@app/shared/components/user-form/user-form.component';
import { EditUserComponent } from '../../components/edit-user/edit-user.component';

@Component({
    selector: 'app-manage-roles',
    standalone: true,
    imports: [
      MatPaginator,
      MatTable,
      MatHeaderCellDef,
      MatCellDef,
      MatColumnDef,
      MatHeaderCell,
      MatRowDef,
      MatHeaderRowDef,
      MatHeaderRow,
      MatCell,
      MatRow,
      DatePipe,
      MatIcon,
      MatIconButton,
      MatButton,
      MatCheckbox,
      PaginatorComponent
    ],
  templateUrl: './manage-patients-page.component.html',
  styleUrl: './manage-patients-page.component.scss',
})
export class ManagePatientsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  pageUserResponseData?: PageRequestResponseData<User>;
  tableHelper = new TableHelper();
  requestParams: UserPageRequestParams = {};
  showDisabled: boolean = false;

  constructor(
    private readonly userService: UserService,
    private readonly toast: SnackbarService,
    private readonly dialog: MatDialog,
    private readonly spinnerService: SpinnerService,
  ) {}

  ngOnInit(): void {
    this.requestParams['roles'] = [UserRole.PATIENT];
    this.getPagedUsers(this.requestParams);
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  getPagedUsers(params: UserPageRequestParams) {
    this.spinnerService.show();
    this.userService.getPagedUsers(params).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data.content);
        this.pageUserResponseData = data;
        this.tableHelper.setSpecifiedBaseColumnNamesFromRequestData(
          this.pageUserResponseData,
          ['name', 'surname', 'email', 'phoneNumber', 'pesel'],
          {
            name: 'Nombre',
            surname: 'Apellido',
            email: 'Correo',
            phoneNumber: 'Teléfono',
            pesel: 'CI'
          }
        );
        this.spinnerService.hide();
      },
      error: () => {
        this.toast.openFailureSnackBar({
          message: 'Error al cargar pacientes'
        });
        this.spinnerService.hide();
      }
    });
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '90%',
      maxWidth: '600px',
      data: {
        forceRole: UserRole.PATIENT
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPagedUsers(this.requestParams);
      }
    });
  }

  toggleDisabled() {
    this.showDisabled = !this.showDisabled;
    localStorage.setItem('show-disabled', String(this.showDisabled));
    this.requestParams['show-disabled'] = this.showDisabled;
    this.getPagedUsers(this.requestParams);
  }

  openEditUserDialog(user: User) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '90%',
      maxWidth: '600px',
      data: {
        user: user,
        forceRole: UserRole.PATIENT
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPagedUsers(this.requestParams);
      }
    });
  }

  deleteUser(user: User) {
    this.spinnerService.show();
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.toast.openSuccessSnackBar({
          message: `Usuario ${user.name} ${user.surname} ha sido eliminado`
        });
        this.getPagedUsers(this.requestParams);
      },
      error: () => {
        this.toast.openFailureSnackBar({
          message: 'Error al eliminar usuario'
        });
        this.spinnerService.hide();
      }
    });
  }
} */