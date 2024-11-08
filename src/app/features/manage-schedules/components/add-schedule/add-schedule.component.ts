import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ScheduleService } from '@core/services/schedule.service';
import { FormType } from '@shared/enums/FormType';
import { SnackbarService } from '@shared/services/snackbar.service';
import { Schedule } from '@core/models/schedule.model';
import { ScheduleFormComponent } from '../schedule-form/schedule-form.component';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-schedule',
  standalone: true,
  imports: [
    ScheduleFormComponent,
    MatDialogModule,
    MatButtonModule,
    MatNativeDateModule
  ],
  providers: [
    {provide: DateAdapter, useClass: NativeDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS}
  ],
  template: `
    <h2 mat-dialog-title>Agregar Horario</h2>
    <mat-dialog-content class="dialog-content">
      <app-schedule-form
        #scheduleForm
        [action]="'Create Schedule'"
        [dialogRef]="dialogRef"
        [formType]="FormType.PopupForm"
        [doctorId]="data.doctorId"
        [startTime]="data.start"
        [endTime]="data.end"
        (submitForm)="onSubmit($event)">
      </app-schedule-form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="scheduleForm.onSubmit()">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content {
      min-width: 300px;
      max-width: 500px;
      width: 100%;
      @media (max-width: 600px) {
        min-width: 250px;
      }
    }
  `]
})
export class AddScheduleComponent {
  @ViewChild(ScheduleFormComponent) scheduleForm!: ScheduleFormComponent;
  FormType = FormType;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      doctorId: string;
      start?: string;
      end?: string;
    },
    public dialogRef: MatDialogRef<AddScheduleComponent>,
    private scheduleService: ScheduleService,
    private snackBarService: SnackbarService
  ) {}

  onSubmit(schedule: Partial<Schedule>): void {
    console.log('Datos originales:', schedule);
    
    const scheduleToSend: Schedule = {
      doctorId: this.data.doctorId,
      scheduleType: schedule.scheduleType!,
      dayOfWeek: schedule.dayOfWeek || null,
      specificDate: schedule.specificDate || null,
      dayOfMonth: schedule.dayOfMonth || null,
      startTime: schedule.startTime ? new Date(schedule.startTime).toISOString() : '',
      endTime: schedule.endTime ? new Date(schedule.endTime).toISOString() : '',
      isActive: schedule.isActive ?? true
    };
    
    console.log('Schedule transformado:', scheduleToSend);
    
    this.scheduleService.createSchedule(scheduleToSend).subscribe({
      next: (result: Schedule) => {
        console.log('Respuesta exitosa:', result);
        this.snackBarService.openSuccessSnackBar({
          message: 'Horario creado exitosamente'
        });
        this.dialogRef.close(result);
      },
      error: (error: any) => {
        console.error('Error detallado:', error);
        this.snackBarService.openFailureSnackBar({
          message: `Error al crear el horario: ${error.error?.message || 'Error desconocido'}`
        });
      }
    });
  }
} 