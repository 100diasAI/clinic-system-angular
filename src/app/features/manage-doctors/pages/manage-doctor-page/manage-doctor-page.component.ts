import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DoctorService } from '@app/core/services/doctor.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PageRequestResponseData } from '@app/shared/models/PageRequestResponseData';
import { Doctor } from '@app/core/models/Doctor';
import { TableHelper } from '@app/shared/helpers/tableHelper';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '@app/shared/spinner/spinner.service';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { DoctorPageRequestParams } from '@app/shared/models/DoctorPageRequestParams';
import { AddDoctorComponent } from '../../components/add-doctor/add-doctor.component';
import { EditDoctorComponent } from '../../components/edit-doctor/edit-doctor.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-manage-doctors-page',
  templateUrl: './manage-doctor-page.component.html',
  styleUrls: ['./manage-doctor-page.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatButtonModule
  ]
})
export class ManageDoctorsPageComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  dataSource: MatTableDataSource<Doctor> = new MatTableDataSource<Doctor>();
  pageDoctorResponseData?: PageRequestResponseData<Doctor>;
  tableHelper = new TableHelper();
  requestParams: DoctorPageRequestParams = {};
  showDisabled: boolean = false;

  constructor(
    private doctorService: DoctorService,
    private dialog: MatDialog,
    private spinnerService: SpinnerService,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getPagedDoctors(this.requestParams);
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  getPagedDoctors(params: DoctorPageRequestParams) {
    this.spinnerService.show();
    this.doctorService.getPagedDoctors(params).subscribe(
      (requestResponseData: PageRequestResponseData<Doctor>) => {
        this.dataSource.data = requestResponseData.content;
        this.pageDoctorResponseData = requestResponseData;
        this.tableHelper.setSpecifiedBaseColumnNamesFromRequestData(
          this.pageDoctorResponseData,
          ['name', 'surname', 'email', 'specialties', 'isEnabled'],
          {
            name: 'Nombre',
            surname: 'Apellido',
            email: 'Correo',
            specialties: 'Especialidades',
            isEnabled: 'Habilitado'
          }
        );
        this.tableHelper.setAllColumnNames(['edit', 'delete']);
        this.spinnerService.hide();
      }
    );
  }

  openAddDoctorDialog() {
    const dialogRef = this.dialog.open(AddDoctorComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPagedDoctors(this.requestParams);
      }
    });
  }

  openEditDoctorDialog(doctor: Doctor) {
    const dialogRef = this.dialog.open(EditDoctorComponent, {
      width: '600px',
      data: { doctor }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPagedDoctors(this.requestParams);
      }
    });
  }

  deleteDoctor(doctor: Doctor) {
    if (confirm(`¿Está seguro de que desea eliminar al doctor ${doctor.name} ${doctor.surname}?`)) {
      this.spinnerService.show();
      this.doctorService.deleteDoctor(doctor.id).subscribe(
        () => {
          this.snackBarService.openSuccessSnackBar({
            message: `Doctor ${doctor.name} ${doctor.surname} eliminado con éxito`
          });
          this.getPagedDoctors(this.requestParams);
          this.spinnerService.hide();
        },
        error => {
          this.snackBarService.openFailureSnackBar({
            message: `Error al eliminar al doctor ${doctor.name} ${doctor.surname}`
          });
          this.spinnerService.hide();
        }
      );
    }
  }

  toggleDisabled() {
    this.showDisabled = !this.showDisabled;
    this.requestParams['show-disabled'] = this.showDisabled;
    this.getPagedDoctors(this.requestParams);
  }
}
