import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DoctorService } from '@app/core/services/doctor.service';
import { FormType } from '@app/shared/enums/FormType';
import { SnackbarService } from '@app/shared/services/snackbar.service';
import { Doctor } from '@app/core/models/Doctor';
import { CreateDoctorDTO } from '@app/core/models/CreateDoctorDTO';
import { UpdateDoctorDTO } from '@app/core/models/UpdateDoctorDTO';
import { CommonModule } from '@angular/common';
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
  loading = false;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.doctorId) {
      this.loadDoctorData();
    }
  }

  initForm() {
    this.doctorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      pesel: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      specialties: [[], Validators.required],
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

  loadDoctorData() {
    if (this.doctorId) {
      this.loading = true;
      this.doctorService.getDoctorById(this.doctorId).subscribe({
        next: (doctor: Doctor) => {
          this.doctorForm.patchValue(doctor);
          this.loading = false;
        },
        error: (error) => {
          this.snackBarService.openFailureSnackBar({
            message: 'Error al cargar los datos del doctor'
          });
          this.loading = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.doctorForm.valid && !this.loading) {
      this.loading = true;
      const doctorData = this.prepareDoctorData();

      const request$ = this.doctorId
        ? this.doctorService.updateDoctor(this.doctorId, doctorData as UpdateDoctorDTO)
        : this.doctorService.createDoctor(doctorData as CreateDoctorDTO);

      request$.subscribe({
        next: () => {
          this.snackBarService.openSuccessSnackBar({
            message: `Doctor ${this.doctorId ? 'actualizado' : 'creado'} con éxito`
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBarService.openFailureSnackBar({
            message: `Error al ${this.doctorId ? 'actualizar' : 'crear'} el doctor`
          });
          this.loading = false;
        }
      });
    }
  }

  private prepareDoctorData() {
    const formValue = this.doctorForm.value;
    return {
      ...formValue,
      specialties: formValue.specialties || [],
      isEnabled: formValue.isEnabled ?? true
    };
  }
}

