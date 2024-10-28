import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DoctorService } from '@app/core/services/doctor.service';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { createDoctor } from '@app/core/models/CreateDoctor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})
export class EditDoctorComponent implements OnInit {
  doctorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private dialogRef: MatDialogRef<EditDoctorComponent>,
    private snackBarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: { createDoctor: createDoctor  }
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

  ngOnInit() {
    this.doctorForm.patchValue(this.data.createDoctor);
  }

  onSubmit() {
    if (this.doctorForm.valid) {
      this.doctorService.updateDoctor(this.data.createDoctor, this.doctorForm.value).subscribe(
        response => {
          this.snackBarService.openSuccessSnackBar({
            message: 'Doctor actualizado con éxito'
          });
          this.dialogRef.close(true);
        },
        error => {
          this.snackBarService.openFailureSnackBar({
            message: 'Error al actualizar el doctor'
          });
        }
      );
    }
  }
}
