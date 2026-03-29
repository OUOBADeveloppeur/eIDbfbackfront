import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { SelectionModel } from '@angular/cdk/collections';
import { rowsAnimation } from '@shared';
import { Direction } from '@angular/cdk/bidi';
import { TableExportUtil } from '@shared';
import { formatDate, NgClass, DatePipe, CommonModule } from '@angular/common';
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
import { Api } from './api.model';
import { AdminService } from '../admin/all-admin/admin.service';
import { AllApiFormComponent } from './dialog/form-dialog/form-dialog.component';
import { AllApiDeleteComponent } from './dialog/delete/delete.component';
import { LogoComponent } from './dialog/logo/logo.component';
@Component({
  selector: 'app-api',
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
        CommonModule
        //DatePipe,
    ],
  templateUrl: './api.component.html',
  styleUrl: './api.component.scss'
})
export class ApiComponent {

  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'id', label: 'ID', type: 'text', visible: false },
    { def: 'name', label: 'Nom', type: 'text', visible: true },
    { def: 'description', label: 'Description', type: 'text', visible: true },
    { def: 'commission', label: 'Commission', type: 'number', visible: true },
    { def: 'logoUrl', label: 'Logo', type: 'image', visible: true },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<Api>([]);
  selection = new SelectionModel<Api>(true, []);
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
    public adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getImageUrl(path: string): string {
  if (!path) return '';
  return path.startsWith('http') ? path : 'http://localhost:8080' + path;
}




  callApi() {
    const data = {
      token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlUHJvZmlsZSBlcHJvZmlsZS5jb2RpbmdhZ2Fpbi5jb20ifQ.nz0Xf0DkFsGWAAbop8vEh9U65QGti7pH8aIgLnHvNmaRF1OMLyIx-SsOUnGLrw75Sph_Afx93DFm-0TOd1lLxQ',
      motif: 'test de fonctionement',
      montant: 50000
    };


    this.adminService.envoyerTransaction(data).subscribe({
      next: (res: Blob) => {
        const fileURL = URL.createObjectURL(res);
        window.open(fileURL, '_blank');
      },
      error: (err) => {
        console.error('Erreur de paiement:', err);
      }
    });
  }


  refresh() {
    this.loadData();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  loadData() {
    this.adminService.getAllApi().subscribe({
      next: (data: any) => {
        // Accéder à la propriété 'contenu' de la réponse API
        this.dataSource.data = data.content || data;
        console.log("Les api====> ", this.dataSource.data);
        this.isLoading = false;
        this.refreshTable();
        
        // Définir le prédicat de filtrage personnalisé
        this.dataSource.filterPredicate = (data: Api, filter: string) => {
          const searchStr = `${data.id} ${data.name} ${data.description} ${data.logoUrl} ${data.commission}`.toLowerCase();
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

  editCall(row: Api) {
    this.openDialog('edit', row);
  }

  // Corrections à apporter dans votre fichier all-admin.component.ts


  addLogo(row:Api){

      const dialogRef = this.dialog.open(LogoComponent, { // Changé ici
    data: { api: row }
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.dataSource.data = this.dataSource.data
      this.refreshTable();
    
    }
  });

  }

// 2. Dans la méthode openDialog, remplacer AllAdminsFormComponent par AllAdminFormComponent
openDialog(action: 'add' | 'edit', data?: Api) {
  console.log("data",data)
  let varDirection: Direction;
  if (localStorage.getItem('isRtl') === 'true') {
    varDirection = 'rtl';
  } else {
    varDirection = 'ltr';
  }
  const dialogRef = this.dialog.open(AllApiFormComponent, { // Changé ici
    width: '60vw',
    maxWidth: '100vw',
    data: { api: data, action },
    direction: varDirection,
    autoFocus: false,
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      if (action === 'add') {
        this.dataSource.data = [result, ...this.dataSource.data];
      } else {
        this.updateRecord(result);
      }
      this.refreshTable();
      this.showNotification(
        action === 'add' ? 'snackbar-success' : 'black',
        `${action === 'add' ? 'Ajout' : 'Modification'} effectué avec succès !`,
        'bottom',
        'center'
      );
    }
  });
}

// 3. Dans la méthode deleteItem, remplacer AllAdminsDeleteComponent par AllAdminDeleteComponent
deleteItem(row: Api) {
  const dialogRef = this.dialog.open(AllApiDeleteComponent, { // Changé ici
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

  
  private updateRecord(updatedRecord: Api) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id === updatedRecord.id
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
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
      'Nom': x.name,
      Description: x.description,
      Commission: x.commission,
      Logo: x.logoUrl,
      //Rôle: x.role,
    }));

    TableExportUtil.exportToExcel(exportData, 'admins_export');
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

  onContextMenu(event: MouseEvent, item: Api) {
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
