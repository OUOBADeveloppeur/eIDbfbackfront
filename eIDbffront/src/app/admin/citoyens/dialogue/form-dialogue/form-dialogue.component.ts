import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatDialogContent, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Department } from 'app/admin/departments/all-departments/department.model';
import { DepartmentService } from 'app/admin/departments/all-departments/department.service';
import { DepartmentsFormComponent } from 'app/admin/departments/all-departments/dialogs/form-dialog/form-dialog.component';
import { Validators } from 'ngx-editor';
import { EmployeesService } from '../../allCitoyens/employees.service';
import { Documents } from '../../documents/document.model';
import { MatDatepickerModule } from '@angular/material/datepicker';


export interface DialogData {
  id: number;
  action: string;
  document: Documents;
}
@Component({
  selector: 'app-form-dialogue',
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatInputModule,
        MatDialogClose,
        MatDatepickerModule,
        CommonModule
    ],
  templateUrl: './form-dialogue.component.html',
  styleUrl: './form-dialogue.component.scss'
})
export class DocumentFormDialogueComponent {

  action: string;
  dialogTitle: string;
  documentForm: UntypedFormGroup;
  document: any;
  autorites: any;
  personneId:any
  typedocuments: any;


  constructor(
    public dialogRef: MatDialogRef<DocumentFormDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public departmentService: DepartmentService,
     private employeService:EmployeesService,
    private fb: UntypedFormBuilder
  ) {
    // Set action and department data
    this.action = data.action;
    this.personneId=data.id
    this.dialogTitle =
      this.action === 'edit'
        ? data.document.libelle

        : 'Nouveau document';
    this.document =
      this.action === 'edit'
        ? data.document
        : new Documents({} as Documents);

    // Create form
    this.documentForm = this.createDepartmentForm();
  }

ngOnInit(){
      console.log("data reçu=====> ",this.personneId)

  this.loadTypeDocumentData()
  this.loadAutoriteData()
}
    loadTypeDocumentData() {
      this.employeService.getTypeDoc().subscribe({
        next: (data:any) => {
          
          this.typedocuments = data;
        
        },
        error: (err) => console.error(err),
      });
    }
      loadAutoriteData() {
      this.employeService.getAutorite().subscribe({
        next: (data:any) => {
          
          this.autorites = data;
        
        },
        error: (err) => console.error(err),
      });
    }
  // Create form group for department fields with validation
  createDepartmentForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.document.id],
      autorite:[this.document.autorite.id, [Validators.required]] ,
      typeDocument: [this.document.typeDocument.id, [Validators.required]] ,
      dateDelivrance:[this.document.dateDelivrance, [Validators.required]]  ,
      dateExpiration:[this.document.dateExpiration]  ,
      numero: [this.document.numero.nip] ,
      reference: [this.document.numero.reference, [Validators.required]] ,
      lieuEtablissement:[this.document.lieuEtablissement]  ,
      contenu:[this.document.contenu]  ,
      taille: [this.document.taille] 
        
    
    });
  }

  /*  hod: [this.department.chefDepartement, [Validators.required]],
      phone: [this.department.telephone, [Validators.required]],
      email: [
        this.department.mail,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      employee_capacity: [
        this.department.employee_capacity,
        [Validators.required],
      ],
      establishedYear: [this.department.establishedYear, [Validators.required]],
      totalEmployees: [this.department.totalEmploye, [Validators.required]],*/

  // Handle form validation errors for user feedback
  getErrorMessage(control: UntypedFormControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (control.hasError('email')) {
      return 'Invalid email format';
    }
    return '';
  }

  // Submit form data
  submit(): void {
   


    if (this.documentForm.valid) {
      const formData = this.documentForm.getRawValue();
      console.log("form data==",formData)
      if (this.action === 'edit') {
        this.employeService.updateDocument(formData,this.document.id).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
          },
        });
      } else {
        this.employeService.addDocument(formData,this.personneId).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Add Error:', error);
          },
        });
      }
    }
  }

  // Close the dialog without submitting
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Confirm and add the department
  public confirmAdd(): void {
    this.submit();
  }

}
