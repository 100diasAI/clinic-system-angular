import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SpecialtyService } from '@app/core/services/specialty.service';
import { FormType } from '@app/shared/enums/FormType';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Specialty } from '@app/core/models/Specialty';

@Component({
  selector: 'app-specialty-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './specialty-form.component.html',
  styleUrls: ['./specialty-form.component.scss']
})
export class SpecialtyFormComponent implements OnInit {
  @Input() action!: string;
  @Input() dialogRef!: MatDialogRef<any>;
  @Input() formType!: FormType;
  @Input() specialtyId?: string;

  specialtyForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private specialtyService: SpecialtyService,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.specialtyId) {
      this.loadSpecialtyData();
    }
  }

  initForm() {
    this.specialtyForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  loadSpecialtyData() {
    this.specialtyService.getSpecialtyById(this.specialtyId!).subscribe(
      specialty => {
        this.specialtyForm.patchValue(specialty);
      },
      error => {
        this.snackBarService.openFailureSnackBar({ message: 'Error loading specialty data' });
      }
    );
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

  createSpecialty(specialtyData: any) {
    this.specialtyService.createSpecialty(specialtyData).subscribe(
      () => {
        this.snackBarService.openSuccessSnackBar({ message: 'Specialty created successfully' });
        this.dialogRef.close(true);
      },
      error => {
        this.snackBarService.openFailureSnackBar({ message: 'Error creating specialty' });
      }
    );
  }

  updateSpecialty(specialtyData: Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>) {
    if (this.specialtyId) {
      this.specialtyService.updateSpecialty(this.specialtyId, specialtyData).subscribe({
        next: (response) => {
          this.snackBarService.openSuccessSnackBar({
            message: 'Especialidad actualizada con éxito',
          });
          this.dialogRef?.close(true);
        },
        error: (error) => {
          this.snackBarService.openFailureSnackBar({
            message: 'Error al actualizar la especialidad',
          });
        }
      });
    }
  }
}
