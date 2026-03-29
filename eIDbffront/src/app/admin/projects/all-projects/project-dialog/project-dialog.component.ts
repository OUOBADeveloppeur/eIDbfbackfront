import { Component, Inject } from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';

import {
  Project,
  ProjectStatus,
  ProjectPriority,
  ProjectType,
} from '../core/project.model';
import { ProjectService } from '../core/project.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatRadioModule } from '@angular/material/radio';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { CommonModule } from '@angular/common';
import { ClientsService } from 'app/admin/clients/all-clients/clients.service';
import { DepartmentService } from 'app/admin/departments/all-departments/department.service';
import { Router } from '@angular/router';
import moment from 'moment';
import { EmployeesService } from 'app/admin/citoyens/allCitoyens/employees.service';

export interface DialogData {
  id: number;
  action: string;
  title: string;
  project: Project;
}

@Component({
    selector: 'app-project-dialog',
    templateUrl: './project-dialog.component.html',
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
        MatDatepickerModule,
        //MatDialogClose,
         NgxEditorModule,
         MatButtonModule,
           //BreadcrumbComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatRadioModule,
        //FileUploadComponent,
        MatButtonModule,
        NgxEditorModule,
        CommonModule
    ]
})
export class ProjectDialogComponent {
  public project: Project;
  public dialogTitle: string;
  public projectForm: UntypedFormGroup;
  public statusChoices: typeof ProjectStatus;
  public priorityChoices: typeof ProjectPriority;
  public projectType: typeof ProjectType;
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
  employes: any;
  departements: any;
  beneficiaires: any;
  types: any;
  priorities:any[]=[{"id":0,"nom":"Basse"},{"id":1,"nom":"Moyenne"},{"id":2,"nom":"Elevée"}]
action: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    private snackBar: MatSnackBar,
    private projectService: ProjectService,
     private clientService:ClientsService,
    private employeService:EmployeesService,
    private departementService:DepartmentService,  
    private router: Router,
  ) {
    this.dialogTitle = data.title;
    this.project = data.project;
    this.statusChoices = ProjectStatus;
    this.priorityChoices = ProjectPriority;
    this.projectType = ProjectType;

    const nonWhiteSpaceRegExp = new RegExp('\\S');

    this.projectForm = this.formBuilder.group({
     projectTitle: [this.project?.nom|| '', [Validators.required]],
      department: [this.project?.department_id|| 0, [Validators.required]],
       description: [this.project?.description|| '', [Validators.required]],
      priority: [this.project?.priority|| '', [Validators.required]],
       type: [this.project?.type|| 0, [Validators.required]],
      client: [this.project?.client|| 0, [Validators.required]],
     // price: ['', [Validators.required]],
      startDate: [this.project?.startDate|| '', [Validators.required]],
      endDate: [this.project?.endDate|| '', [Validators.required]],
      team: [this.project?.team|| 0, [Validators.required]],
      status: [this.project?.statut|| '', [Validators.required]],
      progress: [this.project?.progression|| ''],
    });
  }


    ngOnInit(): void {
    this.editor = new Editor();
    this.loadBeneficiaireData()
    this.loadDepartementData()
    this.loadEmployeData()
    this.loadTypeProjetData()
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


   loadTypeProjetData() {
    this.projectService.getAllTypeProjet().subscribe({
      next: (data: any) => {
        // Accéder à la propriété 'contenu' de la réponse API
        this.types = data.contenu;
        console.log("LEs type de projets=====> ",this.types)
      
      },
      error: (err) => console.error(err),
    });
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
          type_id:this.projectForm.value.type,
          date_debut:dateDebut,
          date_fin_prevue: dateFin
  
  
  
        }
  
      if (this.projectForm.valid) {
        this.projectService.addProject(data).subscribe({
            next: (response) => {
                this.dialogRef.close();
               this.router.navigate(['/admin/dashboard/main']);
  
            },
            error: (error) => {
              console.error('Add Error:', error);
            },
          });
      }
    }
  public onSubmit1(): void {
    console.log('save');
    if (!this.projectForm.valid) {
      return;
    }
    if (this.project) {
      // update project object with form values
      Object.assign(this.project, this.projectForm.value);
      this.projectService.updateObject(this.project);
      this.snackBar.open('Project updated Successfully...!!!', '', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'black',
      });

      this.dialogRef.close();
    } else {
      this.projectService.createOject(this.projectForm.value);
      this.snackBar.open('Project created Successfully...!!!', '', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'black',
      });

      this.dialogRef.close();
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
