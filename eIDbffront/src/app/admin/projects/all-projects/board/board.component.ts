import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Project, ProjectStatus } from '../core/project.model';
import { ProjectService } from '../core/project.service';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { Direction } from '@angular/cdk/bidi';
import { TruncatePipe, PluralPipe } from '../core/pipes';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
    imports: [
        CdkDropList,
        CdkDrag,
        MatProgressBarModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        DatePipe,
        KeyValuePipe,
        TruncatePipe,
        PluralPipe,
    ]
})
export class BoardComponent implements OnInit {
  public lists: object;
  projects: any;
 truncatedDescription: SafeHtml = '';
  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,private sanitizer: DomSanitizer
  ) {
    this.lists = {};
  }

   truncateDescription(html: string, limit: number): SafeHtml {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    const truncated = text.length > limit ? text.substring(0, limit) + '…' : text;
    return this.sanitizer.bypassSecurityTrustHtml(truncated);
  }

  truncateAndSanitize(html: string, limit: number, trail: string): SafeHtml {
    const div = document.createElement('div');
    div.innerHTML = html;

    const text = div.textContent || div.innerText || '';
    const truncated = text.length > limit ? text.substring(0, limit) + trail : text;

    return this.sanitizer.bypassSecurityTrustHtml(truncated);
  }
  public ngOnInit(): void {

    this.loadProject()
    /*this.projectService.getObjects().subscribe((projects: Project[]) => {
      this.lists = {
        NEWPROJECTS: projects.filter(
          (project) => project.status === ProjectStatus.NEWPROJECTS
        ),
        RUNNING: projects.filter(
          (project) => project.status === ProjectStatus.RUNNING
        ),
        ONHOLD: projects.filter(
          (project) => project.status === ProjectStatus.ONHOLD
        ),
        FINISHED: projects.filter(
          (project) => project.status === ProjectStatus.FINISHED
        ),
      };
    });*/
  }

  loadProject(){
     this.projectService.getAllProjectss().subscribe({
      next: (data: any) => {
        // Accéder à la propriété 'contenu' de la réponse API
        this.projects = data.contenu;
        this.projects.forEach((project:any) => {
      project.truncatedHtml = this.truncateDescription(project.description, 280);
    });

          this.lists = {
        NEWPROJECTS: this.projects.filter(
          (project:Project) => project.statut === ProjectStatus.NEWPROJECTS
        ),
        RUNNING: this.projects.filter(
          (project:Project) => project.statut === ProjectStatus.RUNNING
        ),

         ATTENTE:this.projects.filter(
          (project:Project) => project.statut === ProjectStatus.ATTENTE
        ),
        NOTSTART:this.projects.filter(
          (project:Project) => project.statut === ProjectStatus.NOTSTART
        ),
        ONHOLD: this.projects.filter(
          (project:Project) => project.statut === ProjectStatus.ONHOLD
        ),
        FINISHED: this.projects.filter(
          (project:Project) => project.statut === ProjectStatus.FINISHED
        ),
      };
        console.log("les projets===> ",this.projects)
      
      },
      error: (err) => console.error(err),
    });
  }

  unsorted = (): number => {
    return 0;
  };
public drop(event: CdkDragDrop<any>): void {
  if (event.previousContainer !== event.container) {
    const project = event.item.data;
    project.status = ProjectStatus[event.container.id as keyof typeof ProjectStatus];
    this.projectService.updateObject(project);
  }
}

  public addProject(name: string, status: string): void {
    if (!/\S/.test(name)) {
      // do not add project if name is empty or contain white spaces only
      return;
    }
    this.projectService.createOject({
      name,
      status:status,
    });
  }

  public removeProject(project: Project): void {
    // show "deleted" info
    // const snack = this.snackBar.open("The Project has been deleted", "Undo");
    const snack = this.snackBar.open(
      'Project deleted Successfully...!!!',
      'Undo',
      {
        duration: 4000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: 'snackbar-danger',
      }
    );
    // put project to the trash
    this.projectService.detachObject(project);
    // when snack has been removed (dismissed)
    snack.afterDismissed().subscribe((info) => {
      if (info.dismissedByAction !== true) {
        // if dismissed not by undo click (so it dissappeared)
        // then get project by id and delete it
        this.projectService.deleteObject(project);
      }
    });
    // snack action has been taken
    snack.onAction().subscribe(() => {
      // undo button clicked, so remove project from the trash
      this.projectService.attachObject(project);
    });
  }

  public newProjectDialog(): void {
    this.dialogOpen('Create new project', null);
  }

  public editProjectDialog(project: Project): void {
    this.dialogOpen('Edit project', project);
  }

  private dialogOpen(title: string, project: Project | any): void {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    // open angular material dialog
    this.dialog.open(ProjectDialogComponent, {
      width: '60vw',
      maxWidth: '100vw',
      autoFocus: true,
      data: {
        title,
        project,
      },
      direction: tempDirection,
    });
  }
}
