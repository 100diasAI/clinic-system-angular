import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DoctorService } from '@app/core/services/doctor.service';
import { SnackbarService } from '@app/shared/services/snackbar.service';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss']
})
export class AddDoctorComponent {
  doctorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private dialogRef: MatDialogRef<AddDoctorComponent>,
    private snackBarService: SnackbarService
  ) {
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      specialties: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      pesel: ['', Validators.required],
      address: this.fb.group({
        country: ['', Validators.required],
        city: ['', Validators.required],
        street: ['', Validators.required],
        postalCode: ['', Validators.required],
        houseNumber: ['', Validators.required],
        apartmentNumber: ['']
      })
    });
  }

  onSubmit() {
    if (this.doctorForm.valid) {
      this.doctorService.createDoctor(this.doctorForm.value).subscribe(
        response => {
          this.snackBarService.openSuccessSnackBar({
            message: 'Doctor añadido con éxito'
          });
          this.dialogRef.close(true);
        },
        error => {
          this.snackBarService.openFailureSnackBar({
            message: 'Error al añadir el doctor'
          });
        }
      );
    }
  }
}
