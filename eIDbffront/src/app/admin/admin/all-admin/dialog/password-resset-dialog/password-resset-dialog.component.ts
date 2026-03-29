import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdminService } from '../../admin.service';
import { AllAdminFormComponent } from '../form-dialog/form-dialog.component';
import { Admin } from '../../admin.model';


export interface DialogData {
  id: number;
  action: string;
  admin: Admin;
}

@Component({
  selector: 'app-password-resset-dialog',
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
    ],
  templateUrl: './password-resset-dialog.component.html',
  styleUrl: './password-resset-dialog.component.scss'
})
export class PasswordRessetDialogComponent {


   action: string;
  dialogTitle: string;
  adminForm: UntypedFormGroup;
  admin: Admin;

  // Liste des rôles disponibles
  roles :any[] =[];

  constructor(
    public dialogRef: MatDialogRef<AllAdminFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public adminService: AdminService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.admin =
      this.action === 'edit' ? data.admin : new Admin({} as Admin);
    this.dialogTitle =
      this.action === 'edit' 
        ? `Modification du mot de passe de ${this.admin.nom} ${this.admin.prenom}` 
        : 'Nouvel Administrateur';
    this.adminForm = this.createAdminForm();
    console.log('admin recu====> ', this.admin)
  }

private createAdminForm(): UntypedFormGroup {

  const isAdd = this.action === 'add';

  return  this.fb.group({
    id: [this.admin.id],
    password: ['', [Validators.required, Validators.minLength(12)]],
    confirmPassword: ['', [Validators.required]]
    
  

      
    }, {
      // Validateur personnalisé pour confirmer le mot de passe
      validators:  this.passwordMatchValidator 
    });
  }

  // Validateur pour vérifier que les mots de passe correspondent
  private passwordMatchValidator(group: UntypedFormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  




  // Generalized error message method
  getErrorMessage(controlName: string): string {
    const control = this.adminForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `Minimum ${requiredLength} caractères requis`;
    }
    if (control?.hasError('pattern')) {
      if (controlName === 'telephone') {
        return 'Format de téléphone invalide';
      }
      return 'Format invalide';
    }
    if (controlName === 'confirmPassword' && this.adminForm.hasError('passwordMismatch')) {
      return 'Les mots de passe ne correspondent pas';
    }
    return '';
  }

 



  // Handle form submission
  submit(): void {
    if (this.adminForm.valid) {
      const adminData = this.adminForm.getRawValue();
      
      // Retirer confirmPassword avant l'envoi
      if (adminData.confirmPassword) {
        delete adminData.confirmPassword;
      }


     
        this.adminService.updateAdminPassword(adminData,this.data.admin.id).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Erreur de mise à jour:', error);
            // Optionnellement afficher un message d'erreur à l'utilisateur
          },
        });
   
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.adminForm.markAllAsTouched();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
