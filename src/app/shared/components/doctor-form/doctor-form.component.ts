import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DoctorService } from '@app/core/services/doctor.service';
import { createDoctor } from '@app/core/models/CreateDoctor';
import { FormType } from '@app/shared/enums/FormType';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.scss']
})
export class DoctorFormComponent implements OnInit {
  @Input() action!: string;
  @Input() dialogRef!: MatDialogRef<any>;
  @Input() formType!: FormType;
  @Input() doctorId?: string;

  doctorForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.doctorId) {
      this.loadDoctorData();
    }
  }

  initForm() {
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

  loadDoctorData() {
    if (this.doctorId) {
      this.doctorService.getDoctorById(this.doctorId).subscribe(
        (doctor: createDoctor) => {
          this.doctorForm.patchValue(doctor);
        },
        error => {
          console.error('Error loading doctor data', error);
        }
      );
    }
  }

  onSubmit() {
    if (this.doctorForm.valid) {
      const doctorData = this.doctorForm.value;
      if (this.doctorId) {
        this.doctorService.updateDoctor(doctorData, this.doctorId).subscribe(
          () => {
            this.dialogRef.close(true);
          },
          error => {
            console.error('Error updating doctor', error);
          }
        );
      } else {
        this.doctorService.createDoctor(doctorData).subscribe(
          () => {
            this.dialogRef.close(true);
          },
          error => {
            console.error('Error creating doctor', error);
          }
        );
      }
    }
  }
}

