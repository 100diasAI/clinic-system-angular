import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DoctorService } from '@app/core/services/doctor.service';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { Doctor } from '@app/core/models/Doctor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ]
})
export class EditDoctorComponent implements OnInit {
  doctorForm!: FormGroup;
  loading = false;
  formErrors: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    public dialogRef: MatDialogRef<EditDoctorComponent>,
    private snackBarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: { doctor: Doctor }
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.doctorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      doctorDetails: this.fb.group({
        specialization: ['', Validators.required],
        education: [''],
        description: ['']
      })
    });

    this.doctorForm.statusChanges.subscribe(() => {
      if (this.doctorForm.touched) {
        this.checkFormErrors();
      }
    });
  }

  private checkFormErrors(): void {
    const controls = this.doctorForm.controls;
    
    for (const controlName in controls) {
      const control = controls[controlName];
      
      if (control.errors && control.touched) {
        const messages: { [key: string]: string } = {
          required: `El campo ${controlName} es requerido`,
          email: 'El formato del email no es válido',
          minlength: `El campo ${controlName} debe tener al menos 2 caracteres`,
          pattern: 'El formato no es válido'
        };

        const firstError = Object.keys(control.errors)[0];
        this.formErrors[controlName] = messages[firstError] || 'Error de validación';
      } else {
        delete this.formErrors[controlName];
      }
    }
  }

  ngOnInit(): void {
    if (this.data.doctor) {
      this.doctorForm.patchValue({
        name: this.data.doctor.name,
        surname: this.data.doctor.surname,
        email: this.data.doctor.email,
        phoneNumber: this.data.doctor.phoneNumber,
        doctorDetails: {
          specialization: this.data.doctor.doctorDetails?.specialization,
          education: this.data.doctor.doctorDetails?.education,
          description: this.data.doctor.doctorDetails?.description
        }
      });
    }
  }

  onSubmit(): void {
    if (this.doctorForm.valid && !this.loading) {
      this.loading = true;
      const doctorData = this.prepareDoctorData();

      this.doctorService.updateDoctor(this.data.doctor.id, doctorData).subscribe({
        next: () => {
          this.snackBarService.openSuccessSnackBar({
            message: 'Doctor actualizado con éxito'
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBarService.openFailureSnackBar({
            message: 'Error al actualizar el doctor: ' + (error.error?.message || 'Error desconocido')
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.doctorForm);
    }
  }

  private prepareDoctorData() {
    const formValue = this.doctorForm.value;
    return {
      name: formValue.name,
      surname: formValue.surname,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      doctorDetails: {
        specialization: formValue.doctorDetails.specialization,
        education: formValue.doctorDetails.education || null,
        description: formValue.doctorDetails.description || null
      }
    };
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
