import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SpecialtyService } from '@core/services/specialty.service';
import { FormType } from '@shared/enums/FormType';
import { SnackbarService } from '@shared/services/snackbar.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Specialty } from '@core/models/Specialty';

@Component({
  selector: 'app-specialty-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule
  ],
  template: `
    <form [formGroup]="specialtyForm" (ngSubmit)="onSubmit()" [ngClass]="formType === FormType.PopupForm ? 'popup-form' : 'whole-page-form'">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ action === 'Create Specialty' ? 'Nueva Especialidad' : 'Editar Especialidad' }}</mat-card-title>
        </mat-card-header>
        
        <mat-card-content class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="name" placeholder="Nombre de la especialidad">
            @if (specialtyForm.get('name')?.hasError('required') && specialtyForm.get('name')?.touched) {
              <mat-error>El nombre es requerido</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Descripción</mat-label>
            <textarea matInput formControlName="description" rows="4" placeholder="Descripción de la especialidad"></textarea>
            @if (specialtyForm.get('description')?.hasError('required') && specialtyForm.get('description')?.touched) {
              <mat-error>La descripción es requerida</mat-error>
            }
          </mat-form-field>

          <mat-checkbox formControlName="active">Activo</mat-checkbox>
        </mat-card-content>

        <mat-card-actions align="end">
          <ng-content></ng-content>
        </mat-card-actions>
      </mat-card>
    </form>
  `,
  styleUrls: ['./specialty-form.component.scss']
})
export class SpecialtyFormComponent implements OnInit {
  @Input() action!: string;
  @Input() formType!: FormType;
  @Input() dialogRef?: MatDialogRef<any>;
  @Input() specialtyId?: string;

  specialtyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private specialtyService: SpecialtyService,
    private snackBarService: SnackbarService
  ) {
    this.specialtyForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      active: [true]
    });
  }

  ngOnInit() {
    if (this.specialtyId) {
      this.loadSpecialty();
    }
  }

  private loadSpecialty() {
    this.specialtyService.getSpecialtyById(this.specialtyId!).subscribe({
      next: (specialty: Specialty) => {
        this.specialtyForm.patchValue({
          name: specialty.name,
          description: specialty.description,
          active: specialty.active
        });
      },
      error: (error: any) => {
        this.snackBarService.openFailureSnackBar({
          message: 'Error al cargar la especialidad'
        });
      }
    });
  }

  onSubmit() {
    if (this.specialtyForm.valid) {
      const specialtyData = this.specialtyForm.value;
      
      if (this.specialtyId) {
        this.updateSpecialty(specialtyData);
      } else {
        this.createSpecialty(specialtyData);
      }
    }
  }

  private createSpecialty(specialtyData: any) {
    this.specialtyService.createSpecialty(specialtyData).subscribe({
      next: () => {
        this.snackBarService.openSuccessSnackBar({
          message: 'Especialidad creada exitosamente'
        });
        this.dialogRef?.close(true);
      },
      error: (error: any) => {
        this.snackBarService.openFailureSnackBar({
          message: 'Error al crear la especialidad'
        });
      }
    });
  }

  private updateSpecialty(specialtyData: Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>) {
    if (this.specialtyId) {
      this.specialtyService.updateSpecialty(this.specialtyId, specialtyData).subscribe({
        next: () => {
          this.snackBarService.openSuccessSnackBar({
            message: 'Especialidad actualizada exitosamente'
          });
          this.dialogRef?.close(true);
        },
        error: (error: any) => {
          this.snackBarService.openFailureSnackBar({
            message: 'Error al actualizar la especialidad'
          });
        }
      });
    }
  }
}