import { Component, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { SpecialtyFormComponent } from '@app/shared/components/specialty-form/specialty-form.component';
import { FormType } from '@app/shared/enums/FormType';

@Component({
  selector: 'app-add-specialty',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    SpecialtyFormComponent,
  ],
  templateUrl: './add-specialties.component.html',
  styleUrl: './add-specialties.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AddSpecialtyComponent {
  protected readonly FormType = FormType;

  constructor(public dialogRef: MatDialogRef<AddSpecialtyComponent>) {}
}
