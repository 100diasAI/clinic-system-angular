import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Schedule } from '@app/core/models/schedule.model';

export enum ScheduleType {
  WEEKLY = 'WEEKLY',
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY'
}

export enum FormType {
  PopupForm = 'PopupForm',
  WholePageForm = 'WholePageForm'
}

export enum DayOfWeek {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7
}

@Component({
  selector: 'app-schedule-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.scss']
})
export class ScheduleFormComponent implements OnInit {
  @Input() action!: string;
  @Input() formType!: FormType;
  @Input() dialogRef?: MatDialogRef<any>;
  @Input() scheduleId?: string;
  @Input() doctorId!: string;
  @Input() startTime?: string;
  @Input() endTime?: string;
  @Output() submitForm = new EventEmitter<Schedule>();
  
  scheduleForm: FormGroup;
  scheduleTypes = Object.values(ScheduleType);
  daysOfWeek = Object.entries(DayOfWeek)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({ name: key, value }));

  constructor(private fb: FormBuilder) {
    this.scheduleForm = this.fb.group({
      scheduleType: ['', Validators.required],
      dayOfWeek: [''],
      specificDate: [''],
      dayOfMonth: [''],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      isActive: [true],
      doctorId: [this.doctorId, Validators.required] 
    });

    this.scheduleForm.get('scheduleType')?.valueChanges.subscribe(type => {
      this.updateValidators(type);
    });
  }

  ngOnInit() {
    this.scheduleForm.patchValue({
      doctorId: this.doctorId
    });
  }

  private updateValidators(type: ScheduleType) {
    const dayOfWeek = this.scheduleForm.get('dayOfWeek');
    const specificDate = this.scheduleForm.get('specificDate');
    const dayOfMonth = this.scheduleForm.get('dayOfMonth');

    // Resetear validadores
    [dayOfWeek, specificDate, dayOfMonth].forEach(control => {
      control?.clearValidators();
      control?.updateValueAndValidity();
    });

    // Aplicar validadores según tipo
    switch (type) {
      case ScheduleType.WEEKLY:
        dayOfWeek?.setValidators([Validators.required]);
        break;
      case ScheduleType.DAILY:
        specificDate?.setValidators([Validators.required]);
        break;
      case ScheduleType.MONTHLY:
        dayOfMonth?.setValidators([Validators.required, Validators.min(1), Validators.max(31)]);
        break;
    }
  }

  private validateTimeRange() {
    const startTime = this.scheduleForm.get('startTime')?.value;
    const endTime = this.scheduleForm.get('endTime')?.value;

    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);

      if (end <= start) {
        this.scheduleForm.get('endTime')?.setErrors({ invalidRange: true });
      }
    }
  }

  onSubmit() {
    if (this.scheduleForm.valid) {
      const formValue = this.scheduleForm.value;
      const schedule: Partial<Schedule> = {
        doctorId: this.doctorId,
        scheduleType: formValue.scheduleType,
        dayOfWeek: formValue.dayOfWeek || null,
        specificDate: formValue.specificDate || null,
        dayOfMonth: formValue.dayOfMonth || null,
        startTime: formValue.startTime || '',
        endTime: formValue.endTime || '',
        isActive: formValue.isActive ?? true
      };
      
      console.log('Emitiendo formulario:', schedule);
      this.submitForm.emit(schedule as Schedule);
    }
  }
}
