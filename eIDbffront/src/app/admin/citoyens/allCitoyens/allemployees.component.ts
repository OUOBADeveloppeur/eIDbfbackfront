import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EmployeesService } from './employees.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { AllEmployeesFormComponent } from './dialogs/form-dialog/form-dialog.component';
import { AllEmployeesDeleteComponent } from './dialogs/delete/delete.component';
import { SelectionModel } from '@angular/cdk/collections';
import { rowsAnimation } from '@shared';
import { Direction } from '@angular/cdk/bidi';
import { TableExportUtil } from '@shared';
import { formatDate, NgClass, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Personne } from './employees.model';
import { PhotoUploadModalComponent } from './dialogs/photo/photo.component';
import { Router } from '@angular/router';


@Component({
    selector: 'app-allemployees',
    templateUrl: './allemployees.component.html',
    styleUrls: ['./allemployees.component.scss'],
    animations: [rowsAnimation],
    imports: [
        BreadcrumbComponent,
        FormsModule,
        MatTooltipModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatSortModule,
        NgClass,
        MatCheckboxModule,
        FeatherIconsComponent,
        MatRippleModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatPaginatorModule,
        //DatePipe,
    ]
})
export class AllemployeesComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'id', label: 'ID', type: 'text', visible: false },
    { def: 'iu', label: 'Identifiant WURI', type: 'text', visible: true },
     //   { def: 'token', label: 'Token', type: 'text', visible: false },

    { def: 'nom', label: 'Nom', type: 'text', visible: true },
    { def: 'prenom', label: 'Prénom', type: 'text', visible: true },
    { def: 'sexe', label: 'Genre', type: 'text', visible: true },
     { def: 'email', label: 'Email', type: 'email', visible: true },
    { def: 'telephone', label: 'Téléphone', type: 'phone', visible: true },

    { def: 'dateNaissance', label: 'Date de naissance', type: 'date', visible: true },
    
    { def: 'lieuNaissance', label: 'Lieu de naissance', type: 'text', visible: true },
     { def: 'nationalite', label: 'Nationalité', type: 'text', visible: true },
     { def: 'adresse', label: 'Adresse', type: 'text', visible: true },
    { def: 'etat', label: 'Etat', type: 'maps', visible: true },
        { def: 'agent', label: 'Agent', type: 'text', visible: false },

    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];
  avatar="assets/images/avatar.jpg"
  dataSource = new MatTableDataSource<Personne>([]);
  selection = new SelectionModel<Personne>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public employeesService: EmployeesService,
    private snackBar: MatSnackBar,
    private router:Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
    this.loadData();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  getDocument(id:number){
    this.router.navigate(['/admin/citoyens/documents', id]);
  }

  loadData() {
    this.employeesService.getCitoyen().subscribe({
      next: (data:any) => {
        
        this.dataSource.data = data;
        console.log("Les citoyens====> ", this.dataSource.data)
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (data: Personne, filter: string) => {
          const searchStr = `${data.id} ${data.iu} ${data.nom} ${data.prenom} ${data.telephone} ${data.email} ${data.adresse}`.toLowerCase();
          return searchStr.includes(filter);
        };
      },
      error: (err) => console.error(err),
    });
  }

  private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  addNew() {
    this.openDialog('add');
  }

  sendMail(row:any) {
    
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment envoyer les access par mail ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, envoyer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeesService.sendMail(row.id).subscribe((data:any)=>{
          console.log(data)
          if(data.message.includes("Email envoyé avec succès")){
             Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: data.message // affichera : "Email envoyé avec succès !"
        });

          }
          else{
              Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: "Une erreur s'est produite lors de l'envoi du mail."
            });

          }
        });
      }
    }); 
 }
 /*{
      next: (response: string) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: response // affichera : "Email envoyé avec succès !"
        });
      },
  error: () => {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: "Une erreur s'est produite lors de l'envoi du mail."
    });
  }
} */

  editCall(row: Personne) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: Personne) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(AllEmployeesFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { employees: data, action },
      direction: varDirection,
      autoFocus: false,
    });

   /* dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'add') {
          this.dataSource.data = [result, ...this.dataSource.data];
        } else {
          this.updateRecord(result);
        }
        this.refreshTable();
        this.showNotification(
          action === 'add' ? 'snackbar-success' : 'black',
          `${action === 'add' ? 'Ajout' : 'Modification'} effectué(e) avec succès !`,
          'bottom',
          'center'
        );
      }
    });*/

     dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Le modal a renvoyé une réponse (nouveau ou modifié)
     this.loadData();
        this.showNotification(
          action === 'add' ? 'snackbar-success' : 'black',
          `${action === 'add' ? 'Ajout' : 'Modification'} effectué(e) avec succès !`,
          'bottom',
          'center'
        );
    }
  });
  }

  private updateRecord(updatedRecord: Personne) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id === updatedRecord.id
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: Personne) {
    const dialogRef = this.dialog.open(AllEmployeesDeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.id !== row.id
        );
        this.refreshTable();
        this.showNotification(
          'snackbar-danger',
          'Suppression effectuée avec succès !',
          'bottom',
          'center'
        );
      }
    });
  }



  openPhotoModal(row: Personne) {
  const dialogRef = this.dialog.open(PhotoUploadModalComponent, {
    width: '400px',
    data: { iu: row.iu}
  });

  dialogRef.afterClosed().subscribe((newPhotoUrl: string) => {
    if (newPhotoUrl) {
      // Met à jour la photo dans le formulaire
     // this.personnes.photo = newPhotoUrl;
     this.loadData()
    }
  });
}

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  exportExcel() {
    const exportData = this.dataSource.filteredData.map((x) => ({
      ID: x.id,
      Nom: x.nom,
      Prenom: x.prenom,
      Adresse: x.adresse,
      'Téléphone': x.telephone,
      "Email": x.email,
      sexe: x.sexe,
      "Identifiant Unique":x.iu,
      "Date de naissance":x.dateNaissance,
      "Lieu de naissance":x.lieuNaissance,
      "Nationalité":x.nationalite
      
    }));

    TableExportUtil.exportToExcel(exportData, 'employee_data_export');
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.dataSource.data = this.dataSource.data.filter(
      (item) => !this.selection.selected.includes(item)
    );
    this.selection.clear();
    this.showNotification(
      'snackbar-danger',
      `${totalSelect} enregistrement(s) supprimé(s) avec succès !`,
      'bottom',
      'center'
    );
  }

  onContextMenu(event: MouseEvent, item: Personne) {
    event.preventDefault();
    this.contextMenuPosition = {
      x: `${event.clientX}px`,
      y: `${event.clientY}px`,
    };
    if (this.contextMenu) {
      this.contextMenu.menuData = { item };
      this.contextMenu.menu?.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
}