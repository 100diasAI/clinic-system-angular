import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DoctorService } from '@app/core/services/doctor.service';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateDoctorDTO } from '@app/core/models/CreateDoctorDTO';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss'],
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
export class AddDoctorComponent {
  doctorForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    public dialogRef: MatDialogRef<AddDoctorComponent>,
    private snackBarService: SnackbarService
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.doctorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      pesel: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      specialties: [[]],
      isEnabled: [true],
      address: this.fb.group({
        country: ['', Validators.required],
        city: ['', Validators.required],
        street: ['', Validators.required],
        postalCode: ['', Validators.required],
        houseNumber: ['', Validators.required],
        apartmentNumber: ['']
      }),
      doctorDetails: this.fb.group({
        specialization: ['', Validators.required],
        education: [''],
        description: ['']
      })
    });
  }

  onSubmit(): void {
    if (this.doctorForm.valid && !this.loading) {
      this.loading = true;
      const doctorData = this.prepareDoctorData();

      this.doctorService.createDoctor(doctorData).subscribe({
        next: () => {
          this.snackBarService.openSuccessSnackBar({
            message: 'Doctor añadido con éxito'
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBarService.openFailureSnackBar({
            message: 'Error al añadir el doctor: ' + (error.error?.message || 'Error desconocido')
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  private prepareDoctorData(): CreateDoctorDTO {
    const formValue = this.doctorForm.value;
    return {
      name: formValue.name,
      surname: formValue.surname,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      specialization: formValue.doctorDetails.specialization,
      education: formValue.doctorDetails.education || '',
      description: formValue.doctorDetails.description || '',
      isEnabled: true
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
