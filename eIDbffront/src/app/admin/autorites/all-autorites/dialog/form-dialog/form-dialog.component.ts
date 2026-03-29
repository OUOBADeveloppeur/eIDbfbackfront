import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { HolidayService } from '../../all-holidays.service';
import {
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import moment from 'moment';
import { Authorite } from '../../all-holidays.model';

registerLocaleData(localeFr);

export interface DialogData {
  id: number;
  action: string;
  authorite: Authorite;
}

@Component({
    selector: 'app-all-holidays-form',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatDialogClose,
    ]
})
export class AuthoritesFormComponent {
  action: string;
  dialogTitle: string;
  holidayForm: UntypedFormGroup;
  authorite: Authorite;

  constructor(
    public dialogRef: MatDialogRef<AuthoritesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public holidayService: HolidayService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.authorite =
      this.action === 'edit'
        ? data.authorite
        : new Authorite({} as Authorite);
    this.dialogTitle =
      this.action === 'edit' ? this.authorite.libelle : 'Nouvel ajout';
    this.holidayForm = this.createHolidayForm();
  }

  private createHolidayForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.authorite.id],
      libelle: [this.authorite.libelle, [Validators.required]],
      telephone: [this.authorite.telephone, [Validators.required]],
      adresse: [this.authorite.adresse,[Validators.required]],
      email: [this.authorite.email,[Validators.email]],
      siteWeb: [this.authorite.siteWeb],


     
    
    });
  }
/*ngOnInit(){
    if(this.action==='edit'){
  const parts=this.data.Authorite.dateExpiration.split('/')

        const formattedDate = new Date(+parts[2], +parts[1] - 1, +parts[0]);

      
      

          this.holidayForm.patchValue({
            dateExpiration: formattedDate
          });

    }

}*/
  getErrorMessage(controlName: string): string {
    const control = this.holidayForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Required field';
    }
    return '';
  }

  submit(): void {
    if (this.holidayForm.valid) {
      const holidayData = this.holidayForm.getRawValue();
      console.log(holidayData)

       
      
      if (this.action === 'edit') {
        this.holidayService.updateAutorite(holidayData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
           
          },
        });
      } else {
        this.holidayService.addAutorite(holidayData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Add Error:', error);
            // Optionally show an error message to the user
          },
        });
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
