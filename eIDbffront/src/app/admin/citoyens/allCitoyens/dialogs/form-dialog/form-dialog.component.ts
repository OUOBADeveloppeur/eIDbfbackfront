import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { EmployeesService } from '../../employees.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { DepartmentService } from 'app/admin/departments/all-departments/department.service';
import { Department } from 'app/admin/departments/all-departments/department.model';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'app/admin/admin/all-admin/admin.service';
import { Admin } from 'app/admin/admin/all-admin/admin.model';
import { Personne } from '../../employees.model';
import { environment } from 'environments/environment.development';

export interface DialogData {
  id: number;
  action: string;
  employees: Personne;
}

@Component({
    selector: 'app-all-employees-form',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatDialogClose,
        CommonModule
    ]
})
export class AllEmployeesFormComponent {
  action: string;
  dialogTitle: string;
  employeesForm: UntypedFormGroup;
  personnes: Personne;
  photo:string='';

  genres:any[]=[{"id":1,"libelle":"Femme"},{"id":2,"libelle":"Homme"}]

   statuts:any[]=[{"id":1,"libelle":"Actif"},{"id":0,"libelle":"Inactif"}]
  dataSource = new MatTableDataSource<Admin>([]);
  deptTrouve: Department | undefined;


  constructor(
    public dialogRef: MatDialogRef<AllEmployeesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public employeesService: EmployeesService,
       public departmentService: DepartmentService,
           public adminService: AdminService,
       
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults based on action type
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit'
        ? `Modification de : ${data.employees.nom} ${data.employees.prenom}`
        : 'Nouvel ajout';
    this.personnes =
      this.action === 'edit' ? data.employees : new Personne({} as Personne);
      this.photo=environment.apiUrl+"personnes/photo/"+this.personnes.iu
        this.checkImage(this.photo)
      .then(() => this.photo = this.photo)
      .catch(() => this.photo = 'assets/images/avatar.jpg');
    this.employeesForm = this.createEmployeeForm();
  }



  checkImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();
    img.onerror = () => reject();
  });
}

  uploadPhoto(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const formData = new FormData();
  formData.append('file', file);

  // On suppose que adminService a une méthode uploadPhoto(personneId, formData)
  this.employeesService.uploadPhoto(this.personnes.iu, formData).subscribe({
    next: (res: any) => {
      console.log('Photo uploadée avec succès', res);
      // Met à jour l'URL de la photo pour l'affichage immédiat
      this.personnes.photo = res.photoUrl; // renvoyé par ton backend
    },
    error: (err) => console.error('Erreur upload photo:', err)
  });
}


  /* ngOnInit() {
   
    //this.loadUsers();
  }*/

  // Create form group for employee details
  createEmployeeForm(): UntypedFormGroup {
   
    console.log("le departement id=======> ",this.dataSource.data)
    
    return this.fb.group({
      id: [this.personnes.id],
      nom: [this.personnes.nom],
      prenom: [this.personnes.prenom, [Validators.required]],
      telephone: [this.personnes.telephone ],
      adresse: [this.personnes.adresse],
      etat: [this.personnes.etat],
      agentString: [this.personnes.agent== true ? "Oui" : "Non"],
      dateNaissance: [
        this.personnes.dateNaissance,
        [Validators.required],
      ],
      nationalite: [this.personnes.nationalite, [Validators.required]],
      sexe: [this.personnes.sexe, [Validators.required]],
      lieuNaissance: [this.personnes.lieuNaissance, [Validators.required]],


     
      email: [this.personnes.email|| '',[Validators.email]]
    
    });
  }


  loadUsers() {
      this.adminService.getAllUsers().subscribe({
        next: (data:any) => {
          this.dataSource.data = data.content;
         console.log("Les users===>",this.dataSource.data)

          //this.deptTrouve = this.dataSource.data.find(d => d.nom === this.employees.departement);

          //this.isLoading = false;
        
          this.dataSource.filterPredicate = (data: any, filter: string) =>
            Object.values(data).some((value:any) =>
              value.toString().toLowerCase().includes(filter)
            );
        },
        error: (err) => console.error(err),
      });
    }




  // Dynamic error message retrieval
  getErrorMessage(controlName: string): string {
    const control = this.employeesForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Not a valid email';
    }
    return ''; // Return empty if no errors
  }

  // Submit form data
  submit() {

    if (this.employeesForm.valid) {
      const employeeData = this.employeesForm.getRawValue();
      if (this.action === 'edit') {
        this.employeesService.updatePersonne(employeeData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
            // Optionally show an error message to the user
          },
        });
      } else {
        this.employeesService.addPersonne(employeeData).subscribe({
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

  // Close dialog without action
  onNoClick(): void {
    this.dialogRef.close();
  }
}
