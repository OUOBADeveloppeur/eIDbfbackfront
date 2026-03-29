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
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AdminService } from '../../admin.service';
import { Admin } from '../../admin.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

export interface DialogData {
  id: number;
  action: string;
  admin: Admin;
}

@Component({
    selector: 'app-all-admin-form',
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
export class AllAdminFormComponent {
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
        ? `Modifier ${this.admin.nom} ${this.admin.prenom}` 
        : 'Nouvel Administrateur';
    this.adminForm = this.createAdminForm();
    console.log('admin recu====> ', this.admin)
  }

private createAdminForm(): UntypedFormGroup {

  const isAdd = this.action === 'add';

  return  this.fb.group({
    id: [this.admin.id],

    username: [
      this.admin.username,
      [Validators.required, Validators.minLength(3)]
    ],

    nom: [this.admin.nom, [Validators.required]],
    prenom: [this.admin.prenom, [Validators.required]],

    roleid: [this.admin.roleid, [Validators.required]],
    role: [this.admin.role],

    telephone: [
      this.admin.telephone,
      [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]
    ],
    
      ...(this.action === 'add' && {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      })

      
    }, {
      // Validateur personnalisé pour confirmer le mot de passe
      validators: this.action === 'add' ? this.passwordMatchValidator : null
    });
  }

  // Validateur pour vérifier que les mots de passe correspondent
  private passwordMatchValidator(group: UntypedFormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  
private passwordMatchValidatorIfNeeded(isAdd: boolean) {
  return (form: UntypedFormGroup) => {

    const passwordCtrl = form.get('password');
    const confirmCtrl = form.get('confirmPassword');

    const password = passwordCtrl?.value;
    const confirm = confirmCtrl?.value;

    //  MODE EDIT → si les deux champs sont vides → OK
    if (!isAdd && !password && !confirm) {
      return null;
    }

    //  Un seul des deux est rempli
    if ((password && !confirm) || (!password && confirm)) {
      return { passwordIncomplete: true };
    }

    //  Les deux sont remplis mais différents
    if (password !== confirm) {
      return { passwordMismatch: true };
    }

    return null;
  };
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
   this.loadRole() 

  }


   loadRole() {
    this.adminService.getRoles().subscribe({
      next: (data: any) => {
        // Accéder à la propriété 'contenu' de la réponse API
        //this.dataSource.data = data.content || data;
        this.roles=data
        console.log("Les roles====> ",   this.roles);

       
      
      },
      error: (err) => console.error(err),
    });
  }

  // Handle form submission
  submit(): void {
    if (this.adminForm.valid) {
      const adminData = this.adminForm.getRawValue();
      
      // Retirer confirmPassword avant l'envoi
      if (adminData.confirmPassword) {
        delete adminData.confirmPassword;
      }

      if (this.action === 'edit') {
        this.adminService.updateAdmin(adminData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Erreur de mise à jour:', error);
            // Optionnellement afficher un message d'erreur à l'utilisateur
          },
        });
      } else {
        this.adminService.addAdmin(adminData).subscribe({
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