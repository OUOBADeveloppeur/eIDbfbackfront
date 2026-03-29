import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxEditorModule, Toolbar } from 'ngx-editor';
import { Editor } from 'ngx-editor';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ProjectService } from '../all-projects/core/project.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientsService } from 'app/admin/clients/all-clients/clients.service';
import { DepartmentService } from 'app/admin/departments/all-departments/department.service';
import { CommonModule } from '@angular/common';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../../../../dateconfig';
import { Router } from '@angular/router';
import { EmployeesService } from 'app/admin/citoyens/allCitoyens/employees.service';



@Component({
    selector: 'app-add-project',
    templateUrl: './add-project.component.html',
    styleUrls: ['./add-project.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        BreadcrumbComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatRadioModule,
        FileUploadComponent,
        MatButtonModule,
        NgxEditorModule,
        CommonModule
    ],providers:[{ provide: MatDialogRef, useValue: {} }, 
       { provide: MAT_DIALOG_DATA, useValue: {} }, { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, // pour le français
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]
})
export class AddprojectsComponent implements OnInit, OnDestroy {
  projectForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
  beneficiaires:any[]=[]
  employes:any[]=[]
  departements:any[]=[]
  teamList: string[] = [
    'Sarah Smith',
    'John Deo',
    'Pankaj Patel',
    'Pooja Sharma',
  ];
  editor?: Editor;
  html = '';
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

 /*     
   public dialogRef: MatDialogRef<AddprojectsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any*/ 
  constructor(private fb: UntypedFormBuilder,
    private projectService:ProjectService,
     public dialogRef: MatDialogRef<AddprojectsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientService:ClientsService,
    private employeService:EmployeesService,
    private departementService:DepartmentService,  
    private router: Router,
) {
    this.projectForm = this.fb.group({
     // projectID: ['', [Validators.required]],
      projectTitle: ['', [Validators.required]],
      department: ['', [Validators.required]],
       description: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      client: ['', [Validators.required]],
     // price: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      team: ['', [Validators.required]],
      status: ['', [Validators.required]],
     // fileUpload: [''],
    });
  }
  ngOnInit(): void {
    this.editor = new Editor();
    this.loadBeneficiaireData()
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
    loadBeneficiaireData() {
    this.clientService.getAllClients().subscribe({
      next: (data: any) => {
        // Accéder à la propriété 'contenu' de la réponse API
        this.beneficiaires = data.contenu;
      
      },
      error: (err) => console.error(err),
    });
  }
  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor?.destroy();
  }
  onSubmit1() {
    console.log('Form Value', this.projectForm.value);


  }


    onSubmit(): void {
   
      console.log('Form Value', this.projectForm.value);
      let dateDebut=''
      let dateFin=''

      if (moment.isMoment(this.projectForm.get("startDate")?.value)) {
            dateDebut = this.projectForm.get("startDate")?.value.format('DD/MM/YYYY');
          
          }
      if (moment.isMoment(this.projectForm.get("endDate")?.value)) {
        dateFin = this.projectForm.get("endDate")?.value.format('DD/MM/YYYY');
      
      }

           
      const data={
        nom:this.projectForm.value.projectTitle,
        description:this.projectForm.value.description,
        statut:this.projectForm.value.status,
        priorite:this.projectForm.value.priority,
        responsable_id:this.projectForm.value.team[0],
        departement_id:this.projectForm.value.department,
        beneficiaire_id:this.projectForm.value.client,
        date_debut:dateDebut,
        date_fin_prevue: dateFin



      }

    if (this.projectForm.valid) {
      this.projectService.addProject(data).subscribe({
          next: (response) => {
             this.router.navigate(['/admin/dashboard/main']);

          },
          error: (error) => {
            console.error('Add Error:', error);
          },
        });
    }
  }

}
