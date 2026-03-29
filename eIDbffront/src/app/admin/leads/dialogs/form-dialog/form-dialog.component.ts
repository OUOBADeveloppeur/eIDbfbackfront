import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { LeadsService } from '../../leads.service';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Leads } from '../../leads.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DepartmentService } from 'app/admin/departments/all-departments/department.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { NgxEditorModule } from 'ngx-editor';
import { EmployeesService } from 'app/admin/citoyens/allCitoyens/employees.service';

export interface DialogData {
  id: number;
  action: string;
  leads: Leads;
}

@Component({
    selector: 'app-leads-form',
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
        MatDialogClose
          ,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatRadioModule,
        MatButtonModule,
        NgxEditorModule,
    ]
})
export class LeadsFormComponent {
  action: string;
  dialogTitle: string;
  leadsForm: UntypedFormGroup;
  leads: Leads;
  departements: any;
  employes: any;

  constructor(
    public dialogRef: MatDialogRef<LeadsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public leadsService: LeadsService,
    private employeService:EmployeesService,
    private departementService:DepartmentService,  
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.leads = this.action === 'edit' ? data.leads : new Leads({} as Leads);
    this.dialogTitle =
      this.action === 'edit' ? `Modifier ${this.leads.chefDepartement}` : 'Nouveau responsable';
    this.leadsForm = this.createLeadsForm();
  }

  // Create the form for Leads
  private createLeadsForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.leads.id],
     
      departement: [this.leads.departement,Validators.required],
      chef: [this.leads.chef,Validators.required],
    });
  }



    ngOnInit(): void {

      console.log("Les data en edit==========> ",this.leads)
   
    this.loadDepartementData()
    this.loadEmployeData()
  }
  loadDepartementData() {
    this.departementService.getAllDepartments().subscribe({
      next: (data:any) => {
        this.departements= data.contenu;
      },
      error: (err) => console.error(err),
    });
  }


    loadEmployeData() {
      this.employeService.getCitoyen().subscribe({
        next: (data:any) => {
          
          this.employes = data.contenu;
        
        },
        error: (err) => console.error(err),
      });
    }
  // Error message handling for all fields
  getErrorMessage(controlName: string): string {
    const control = this.leadsForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Not a valid email';
    }
    if (control?.hasError('pattern')) {
      return 'Invalid phone number format';
    }
    return '';
  }

  // Submit logic
  submit(): void {
    if (this.leadsForm.valid) {
      const leadsData = this.leadsForm.getRawValue();

      console.log("Form data===========> ",leadsData)
      if (this.action === 'edit') {
        this.leadsService.updateLeads(leadsData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
            // Optionally show an error message to the user
          },
        });
      } else {
        this.leadsService.addLeads(leadsData).subscribe({
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

  // Close the dialog
  onNoClick(): void {
    this.dialogRef.close();
  }
}
