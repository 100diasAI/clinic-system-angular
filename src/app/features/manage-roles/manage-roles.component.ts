/* import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '@app/core/services/user.service';
import { UserRole } from '@app/core/enums/UserRole';
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
//import { EditUserComponent } from '../../components/edit-user/edit-user.component';

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
    templateUrl: './manage-roles.component.html',
    styleUrl: './manage-roles.component.scss',
  })
  export class ManageRolesComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator?: MatPaginator;
    dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
    pageUserResponseData?: PageRequestResponseData<User>;
    tableHelper = new TableHelper();
    requestParams: UserPageRequestParams = {};
    showDisabled?: boolean = false;
  
    constructor(
      private readonly userService: UserService,
      private readonly toast: SnackbarService,
      private readonly dialog: MatDialog,
      private readonly spinnerService: SpinnerService,
    ) {}
  
    ngOnInit(): void {
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
            ['name', 'surname', 'email', 'role', 'isEnabled'],
            {
              name: 'Nombre',
              surname: 'Apellido',
              email: 'Correo',
              role: 'Rol',
              isEnabled: 'Estado'
            }
          );
          this.spinnerService.hide();
        },
        error: () => {
          this.toast.openFailureSnackBar({
            message: 'Error al cargar usuarios'
          });
          this.spinnerService.hide();
        }
      });
    }
  
    toggleUserStatus(user: User) {
      this.spinnerService.show();
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.toast.openSuccessSnackBar({
            message: `Usuario ${user.isEnabled ? 'deshabilitado' : 'habilitado'} exitosamente`
          });
          this.getPagedUsers(this.requestParams);
        },
        error: () => {
          this.toast.openFailureSnackBar({
            message: 'Error al cambiar estado del usuario'
          });
          this.spinnerService.hide();
        }
      });
    }
  
    openEditUserDialog(user: User) {
      const dialogRef = this.dialog.open(EditUserComponent, {
        width: '90%',
        maxWidth: '1200px',
        data: {
          user: user
        }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getPagedUsers(this.requestParams);
        }
      });
    }
  } */