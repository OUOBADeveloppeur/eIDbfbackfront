import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AdminService } from './admin.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Admin } from './admin.model';
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
import { AllAdminFormComponent } from './dialog/form-dialog/form-dialog.component';
import { AllAdminDeleteComponent } from './dialog/delete/delete.component';
import { PasswordRessetDialogComponent } from './dialog/password-resset-dialog/password-resset-dialog.component';

@Component({
    selector: 'app-all-admins',
    templateUrl: './all-admin.component.html',
    styleUrls: ['./all-admin.component.scss'],
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
export class AllAdminComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'id', label: 'ID', type: 'number', visible: false },
    { def: 'username', label: 'Nom d\'utilisateur', type: 'text', visible: true },
    { def: 'nom', label: 'Nom', type: 'text', visible: true },
    { def: 'prenom', label: 'Prénom', type: 'text', visible: true },
    { def: 'telephone', label: 'Téléphone', type: 'phone', visible: true },
    { def: 'role', label: 'Rôle', type: 'text', visible: true },
    { def: 'roleid', label: 'RôleId', type: 'text', visible: false },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<Admin>([]);
  selection = new SelectionModel<Admin>(true, []);
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

  refresh() {
    this.loadData();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  loadData() {
    this.adminService.getAllAdmins().subscribe({
      next: (data: any) => {
        // Accéder à la propriété 'contenu' de la réponse API
        this.dataSource.data = data.content || data;
        console.log("Les administrateurs====> ", this.dataSource.data);
        this.isLoading = false;
        this.refreshTable();
        
        // Définir le prédicat de filtrage personnalisé
        this.dataSource.filterPredicate = (data: Admin, filter: string) => {
          const searchStr = `${data.id} ${data.username} ${data.nom} ${data.prenom} ${data.telephone} ${data.role}`.toLowerCase();
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

  editCall(row: Admin) {
    this.openDialog('edit', row);
  }

  // Corrections à apporter dans votre fichier all-admin.component.ts


// 2. Dans la méthode openDialog, remplacer AllAdminsFormComponent par AllAdminFormComponent
openDialog(action: 'add' | 'edit', data?: Admin) {
  let varDirection: Direction;
  if (localStorage.getItem('isRtl') === 'true') {
    varDirection = 'rtl';
  } else {
    varDirection = 'ltr';
  }
  const dialogRef = this.dialog.open(AllAdminFormComponent, { // Changé ici
    width: '60vw',
    maxWidth: '100vw',
    data: { admin: data, action },
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
      this.loadData();
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
deleteItem(row: Admin) {
  const dialogRef = this.dialog.open(AllAdminDeleteComponent, { // Changé ici
    data: row,
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.dataSource.data = this.dataSource.data.filter(
        (record) => record.id !== row.id
      );
      this.loadData();
      this.showNotification(
        'snackbar-danger',
        'Suppression effectuée avec succès !',
        'bottom',
        'center'
      );
    }
  });
}

ressetPassword(action: 'add' | 'edit',row: Admin) {
  const dialogRef = this.dialog.open(PasswordRessetDialogComponent, {
      width: '700px',        // largeur
    maxWidth: '90vw',      // largeur max responsive
    height: 'auto',  // Changé ici
   data:{
    admin: row,
    action:action
   }
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.dataSource.data = this.dataSource.data.filter(
        (record) => record.id !== row.id
      );
      this.loadData();
      this.showNotification(
        'snackbar-danger',
        'Modification effectuée avec succès !',
        'bottom',
        'center'
      );
    }
  });
}

  
  private updateRecord(updatedRecord: Admin) {
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
      'Nom d\'utilisateur': x.username,
      Nom: x.nom,
      Prénom: x.prenom,
      Téléphone: x.telephone,
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

  onContextMenu(event: MouseEvent, item: Admin) {
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