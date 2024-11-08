import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SpecialtyService } from '@app/core/services/specialty.service';
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
import { Specialty } from '@app/core/models/Specialty';
import { SpecialtyTableHelper } from '../../helpers/specialtyTableHelper';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditSpecialtyComponent } from '../../components/edit-specialties/edit-specialties.component';
import { AddSpecialtyComponent } from '../../components/add-specialties/add-specialties.component';
import { SpinnerService } from '@app/shared/spinner/spinner.service';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { CapitalizeSpaceBetweenPipe } from '@app/shared/pipes/capitalize-space-between.pipe';
import { LastPropertyPipe } from '@app/shared/pipes/last-property.pipe';
import { PaginatorComponent } from '@app/shared/components/paginator/paginator.component';
import { DatePipe } from '@app/shared/pipes/date.pipe';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-manage-specialties-page',
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
    CapitalizeSpaceBetweenPipe,
    LastPropertyPipe,
    PaginatorComponent,
    DatePipe,
    MatIcon,
    MatIconButton,
    MatButton,
  ],
  templateUrl: './manage-specialties-page.component.html',
  styleUrl: './manage-specialties-page.component.scss',
})
export class ManageSpecialtiesPageComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  dataSource: MatTableDataSource<Specialty> = new MatTableDataSource<Specialty>();
  tableHelper = new SpecialtyTableHelper();

  constructor(
    private readonly specialtyService: SpecialtyService,
    private readonly dialog: MatDialog,
    private readonly spinnerService: SpinnerService,
    private readonly snackBarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.loadSpecialties();
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  loadSpecialties() {
    this.spinnerService.show();
    this.specialtyService.getAllSpecialties().subscribe({
      next: (specialties) => {
        this.dataSource = new MatTableDataSource(specialties);
        this.tableHelper.setColumnConfiguration(
          ['id', 'name', 'description', 'active', 'createdAt', 'updatedAt'],
          {
            id: 'ID',
            name: 'Nombre',
            description: 'Descripción',
            active: 'Activo',
            createdAt: 'Creado',
            updatedAt: 'Actualizado',
          }
        );
        this.tableHelper.setAllColumnNames(['edit', 'delete']);
        this.spinnerService.hide();
      },
      error: (error) => {
        this.snackBarService.openFailureSnackBar({
          message: 'Error al cargar las especialidades',
        });
        this.spinnerService.hide();
      }
    });
  }

  openEditSpecialtyDialog(specialty: Specialty) {
    const dialogRef: MatDialogRef<EditSpecialtyComponent> = this.dialog.open(
      EditSpecialtyComponent,
      {
        width: '600px',
        data: {
          specialty: specialty,
        },
      },
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSpecialties();
      }
    });
  }

  openAddSpecialtyDialog() {
    const dialogRef: MatDialogRef<AddSpecialtyComponent> = this.dialog.open(
      AddSpecialtyComponent,
      {
        width: '600px',
      },
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSpecialties();
      }
    });
  }

  deleteSpecialty(specialty: Specialty) {
    this.spinnerService.show();
    this.specialtyService.deleteSpecialty(specialty.id).subscribe({
      next: () => {
        this.snackBarService.openSuccessSnackBar({
          message: `Especialidad ${specialty.name} eliminada con éxito`,
        });
        this.loadSpecialties();
      },
      error: (error) => {
        this.snackBarService.openFailureSnackBar({
          message: 'Error al eliminar la especialidad',
        });
        this.spinnerService.hide();
      }
    });
  }
}
