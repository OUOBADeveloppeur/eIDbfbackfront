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
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Api } from '../../api.model';
import { AdminService } from 'app/admin/admin/all-admin/admin.service';

export interface DialogData {
  id: number;
  action: string;
  api: Api;
}

@Component({
    selector: 'app-all-api-form',
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
    ]
})
export class AllApiFormComponent {
  action: string;
  dialogTitle: string;
  adminForm: UntypedFormGroup;
  api: Api;

  // Liste des rôles disponibles
  roles :any[] =[];

  constructor(
    public dialogRef: MatDialogRef<AllApiFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public adminService: AdminService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.api =
      this.action === 'edit' ? data.api : new Api({} as Api);
    this.dialogTitle =
      this.action === 'edit' 
        ? `Modifier ${this.api?.name} ` 
        : 'Nouvelle Api';
    this.adminForm = this.createAPiForm();
  }

  // Create the form with validation
  private createAPiForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.api?.id],
      name: [this.api?.name, [Validators.required, Validators.minLength(3)]], // Username validation
      commission: [this.api?.commission, [Validators.required]], // Nom is required
      description: [this.api?.description, [Validators.required]],
      logoUrl: [this.api?.logoUrl],
    
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

  ngOnInit(){
  // this.loadRole() 

  }


   loadRole() {
    this.adminService.getRoles().subscribe({
      next: (data: any) => {
        // Accéder à la propriété 'contenu' de la réponse API
        //this.dataSource.data = data.content || data;
        this.roles=data.content
        console.log("Les roles====> ",   this.roles);

       
      
      },
      error: (err) => console.error(err),
    });
  }

  // Handle form submission
  submit(): void {
    if (this.adminForm.valid) {
      const apiData = this.adminForm.getRawValue();
      
     

      if (this.action === 'edit') {
        this.adminService.updateApi(apiData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Erreur de mise à jour:', error);
            // Optionnellement afficher un message d'erreur à l'utilisateur
          },
        });
      } else {
        this.adminService.addApi(apiData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Erreur d\'ajout:', error);
            // Optionnellement afficher un message d'erreur à l'utilisateur
          },
        });
      }
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.adminForm.markAllAsTouched();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}