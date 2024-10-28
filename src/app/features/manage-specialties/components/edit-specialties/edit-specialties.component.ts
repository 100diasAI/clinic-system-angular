import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { Specialty } from '@app/core/models/Specialty';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { SpecialtyFormComponent } from '@app/shared/components/specialty-form/specialty-form.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { FormType } from '@app/shared/enums/FormType';

@Component({
  selector: 'app-edit-specialty',
  standalone: true,
  imports: [
    MatDialogContent,
    SpecialtyFormComponent,
    MatDialogTitle,
    MatDialogActions,
    MatIcon,
    MatButton,
    MatDialogClose,
  ],
  templateUrl: './edit-specialties.component.html',
  styleUrl: './edit-specialties.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EditSpecialtyComponent {
  protected readonly FormType = FormType;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      specialty: Specialty;
    },
    public dialogRef: MatDialogRef<EditSpecialtyComponent>,
  ) {}
}
