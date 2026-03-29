import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HolidayService } from './all-holidays.service';
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
import { AllHolidaysDeleteComponent } from './dialog/delete/delete.component';
import { Transaction } from './transaction.model';
import { Authorite } from './all-holidays.model';
import { AuthoritesFormComponent } from './dialog/form-dialog/form-dialog.component';

@Component({
    selector: 'app-allholiday',
    templateUrl: './all-holidays.component.html',
    styleUrls: ['./all-holidays.component.scss'],
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
        CommonModule,
        MatCheckboxModule,
        FeatherIconsComponent,
        MatRippleModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatPaginatorModule,
        DatePipe,
    ]
})
export class AllHolidayComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { label: 'ID', def: 'id', type: 'number', visible: false },
    { label: 'Libellé', def: 'libelle', type: 'text', visible: true },
    { label: 'Téléphone', def: 'telephone', type: 'phone', visible: true },
    { label: 'Email', def: 'email', type: 'email', visible: true },
    { label: 'Adresse', def: 'adresse', type: 'text', visible: true },
    { label: 'Site web', def: 'siteWeb', type: 'text', visible: true },
  
   { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<Authorite>([]);
  selection = new SelectionModel<Authorite>(true, []);
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
    public holidayService: HolidayService,
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
formatCellValue(row: any, def: string): string {
  if (def === 'date' && row['date']) {
    return new Date(row['date']).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  if (def === 'heure' && row['heure']) {
    return row['heure'].substring(0, 8);
  }

  return row[def];
}


  loadData() {
    this.holidayService.getAllAuthorities().subscribe({
      next: (data:any) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        console.log(this.dataSource.data)
     this.dataSource.filterPredicate = (data: Authorite, filter: string): boolean => {
      const searchText = filter.toLowerCase();
      return (
        (data.libelle?.toLowerCase().includes(searchText) ?? false) ||
        (data.adresse?.toLowerCase().includes(searchText) ?? false) ||
        (data.siteWeb?.toString().toLowerCase().includes(searchText) ?? false) ||
        (data.telephone?.toLowerCase().includes(searchText) ?? false) ||
        (data.email?.toLowerCase().includes(searchText) ?? false)
      );
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

  editCall(row: Authorite) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: Authorite) {
    //console.log("La data dans dialogue====> ",data)
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(AuthoritesFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { authorite: data, action },
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
          `${action === 'add' ? 'Add' : 'Edit'} Record Successfully...!!!`,
          'bottom',
          'center'
        );
      }
    });
  }

  private updateRecord(updatedRecord: Authorite) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id === updatedRecord.id
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: Authorite) {
    const dialogRef = this.dialog.open(AllHolidaysDeleteComponent, {
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
          'Delete Record Successfully...!!!',
          'bottom',
          'center'
        );
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
       'Libelle': x.libelle,
      'Téléphone': x.telephone,
      Email: x.email,
        Adresse: x.adresse,
         'Site Web': x.siteWeb
      
     
    }));

    TableExportUtil.exportToExcel(exportData, 'holidays_export');
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
      `${totalSelect} Record(s) Deleted Successfully...!!!`,
      'bottom',
      'center'
    );
  }
  onContextMenu(event: MouseEvent, item: Authorite) {
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
