import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
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
import { Eservice } from '../../all-eservices.model';
import { EserviceService } from '../../all-eservices.service';

registerLocaleData(localeFr);

export interface DialogData {
  id: number;
  action: string;
  authorite: Eservice;
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
export class EserviceFormComponent {
  action: string;
  dialogTitle: string;
  holidayForm: UntypedFormGroup;
  authorite: Eservice;

  constructor(
    public dialogRef: MatDialogRef<EserviceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public eserviceService: EserviceService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.authorite =
      this.action === 'edit'
        ? data.authorite
        : new Eservice({} as Eservice);
    this.dialogTitle =
      this.action === 'edit' ? this.authorite.libelle : 'Nouvel ajout';
    this.holidayForm = this.createHolidayForm();
  }

  private createHolidayForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.authorite.id],
      libelle: [this.authorite.libelle, [Validators.required]],
      url: [this.authorite.url],
      description: [this.authorite.description,[Validators.required]],
     


     
    
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
        this.eserviceService.updateEservice(holidayData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
           
          },
        });
      } else {
        this.eserviceService.addEservice(holidayData).subscribe({
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
