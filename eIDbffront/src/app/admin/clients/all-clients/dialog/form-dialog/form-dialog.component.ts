import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ClientsService } from '../../clients.service';
import { Clients } from '../../clients.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

export interface DialogData {
  id: number;
  action: string;
  clients: Clients;
}

@Component({
    selector: 'app-all-clients-form',
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
        MatDialogClose,
        CommonModule
    ]
})
export class AllClientsFormComponent {
  action: string;
  dialogTitle: string;
  clientForm: UntypedFormGroup;
  clients: Clients;

  constructor(
    public dialogRef: MatDialogRef<AllClientsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public clientService: ClientsService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.clients =
      this.action === 'edit' ? data.clients : new Clients({} as Clients);
    this.dialogTitle =
      this.action === 'edit' ? `Edit ${this.clients.nom} ${this.clients.prenom}` : 'New Client';
    this.clientForm = this.createClientForm();
  }

  // Create the form with validation
  private createClientForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.clients.id],
      email: [this.clients.email, [Validators.required, Validators.email]], // Email validation
      structure: [this.clients.structure, [Validators.required]],
      nom: [this.clients.nom, [Validators.required]], // Nom is required
      prenom: [this.clients.prenom, [Validators.required]], // Prenom is required
      //role: [this.clients.role, [Validators.required]],
      telephone: [
        this.clients.telephone,
        [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)],
      ],
       password: [
        '',
        [Validators.required, Validators.minLength(12)],
      ],
      confirm: [
        '',
        [Validators.required, Validators.minLength(12)],
      ] // Telephone validation
    },{ validator: this.passwordsMatchValidator });
  }
  passwordsMatchValidator(group: UntypedFormGroup) {
  const password = group.get('password')?.value;
  const confirm = group.get('confirm')?.value;
  return password === confirm ? null : { mismatch: true };
}

  // Generalized error message method
  getErrorMessage(controlName: string): string {
    const control = this.clientForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (control?.hasError('pattern')) {
      return 'Invalid format';
    }
    return '';
  }

  // Handle form submission
  submit(): void {
    if(this.action==="edit"){
       const clientData = this.clientForm.getRawValue();
        this.clientService.updateClient(clientData).subscribe({
          
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
            // Optionally show an error message to the user
          },
        });
    }
    else if(this.clientForm.valid){
       const clientData = this.clientForm.getRawValue();

    this.clientService.addClient(clientData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Add Error:', error);
            // Optionally show an error message to the user
          },
        });
    }
     console.log("Appelle===> ",this.clientForm.valid)
   /* if (this.clientForm.valid) {
      const clientData = this.clientForm.getRawValue();
        console.log("Appelle===> ",clientData)
      if (this.action === 'edit') {
        this.clientService.updateClient(clientData).subscribe({
          
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
            // Optionally show an error message to the user
          },
        });
      } else {
        this.clientService.addClient(clientData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Add Error:', error);
            // Optionally show an error message to the user
          },
        });
      }
    }*/
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}