import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { EmployeeSalaryService } from '../../employee-salary.service';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { EmployeeSalary } from '../../employee-salary.model';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ClientsService } from 'app/admin/clients/all-clients/clients.service';
import { CommonModule } from '@angular/common';
import moment, { months } from 'moment';
import { Payout } from '../../payout.model';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

export interface DialogData {
  id: string;
  action: string;
  employeeSalary: Payout;
  plateformeNom:string
}

@Component({
    selector: 'app-employee-salary-form',
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
        MatOptionModule,
        MatDialogClose,
        MatDatepickerModule,CommonModule
    ]
})
export class EmployeeSalaryFormComponent {
  action: string;
  dialogTitle: string;
  employeeSalaryForm: UntypedFormGroup;
  employeeSalary: Payout;
  plateformes: any;

  constructor(
    public dialogRef: MatDialogRef<EmployeeSalaryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public employeeSalaryService: EmployeeSalaryService, 
     private clientService:ClientsService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.employeeSalary =
      this.action === 'edit'
        ? data.employeeSalary
        : new Payout({} as Payout);
    this.dialogTitle =
      this.action === 'edit'
        ? `Payment sortant pour `
        : 'Nouveau payment sortant';
    this.employeeSalaryForm = this.createEmployeeSalaryForm();
   // this.subscribeToSalaryChanges();
  }

  // Create the form for Employee Salary
  private createEmployeeSalaryForm(): UntypedFormGroup {

   // console.log("La date",this.employeeSalaryForm.get('datemonitoring')?.value)
    return this.fb.group({
      id: [this.employeeSalary.id],
     
      plateformeId: [this.employeeSalary.plateformeId, Validators.required],
     
      montant: [this.employeeSalary.montant,Validators.required],
      

    });
  }
  loadPlateformeData() {
    this.employeeSalaryService.getPersonnesWithTransaction().subscribe({
      next: (data: any) => {
        // Accéder à la propriété 'contenu' de la réponse API
        this.plateformes = data.content;
        console.log(this.plateformes)
      
      },
      error: (err) => console.error(err),
    });
  }
  // 
  // Automatically calculate net salary when salary, bonus, or deductions change
  private subscribeToSalaryChanges(): void {
    this.employeeSalaryForm
      .get('salary')
      ?.valueChanges.subscribe(() => this.calculateNetSalary());
    this.employeeSalaryForm
      .get('bonus')
      ?.valueChanges.subscribe(() => this.calculateNetSalary());
    this.employeeSalaryForm
      .get('deductions')
      ?.valueChanges.subscribe(() => this.calculateNetSalary());
  }
ngOnInit(): void {
   
    this.loadPlateformeData()

   
   
  }
  // Calculate net salary
  private calculateNetSalary(): void {
    const salary = this.employeeSalaryForm.get('salary')?.value || 0;
    const bonus = this.employeeSalaryForm.get('bonus')?.value || 0;
    const deductions = this.employeeSalaryForm.get('deductions')?.value || 0;
    const netSalary = salary + bonus - deductions;
    this.employeeSalaryForm.get('netSalary')?.setValue(netSalary);
  }

  // Error message handling for all fields
  getErrorMessage(controlName: string): string {
    const control = this.employeeSalaryForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Not a valid email';
    }
    return '';
  }

  // Form submit logic
  submit(): void {
    if (this.employeeSalaryForm.valid) {
      const salaryData = this.employeeSalaryForm.getRawValue();

     
      
      if (this.action === 'edit') {
        this.employeeSalaryService.updatePayout(salaryData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
            // Optionally show an error message to the user
          },
        });
      } else {
        this.employeeSalaryService.addPayout(salaryData).subscribe({
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
