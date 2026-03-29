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
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Transaction } from 'app/admin/autorites/all-autorites/transaction.model';
import { HolidayService } from 'app/admin/autorites/all-autorites/all-holidays.service';
import { AllHolidaysDeleteComponent } from 'app/admin/autorites/all-autorites/dialog/delete/delete.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Authorite } from 'app/admin/autorites/all-autorites/all-holidays.model';
import { AuthoritesFormComponent } from 'app/admin/autorites/all-autorites/dialog/form-dialog/form-dialog.component';
import { EmployeesService } from 'app/admin/citoyens/allCitoyens/employees.service';
@Component({
  selector: 'app-transactions',
    animations: [rowsAnimation],
    imports: [
        BreadcrumbComponent,
         FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
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
    ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit, OnDestroy{

    columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { label: 'ID', def: 'id', type: 'string', visible: false },
    { label: 'Personne', def: 'Personne', type: 'text', visible: true },
    { label: 'Montant', def: 'montant', type: 'number', visible: true },
    { label: 'Motif', def: 'motif', type: 'text', visible: true },
    { label: 'Numéro', def: 'numero', type: 'text', visible: true },
    { label: 'Api', def: 'api', type: 'text', visible: true },
    { label: 'Date', def: 'date', type: 'text', visible: true },
    { label: 'Heure', def: 'heure', type: 'text', visible: true },
  // { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<Transaction>([]);
 
  selection = new SelectionModel<Transaction>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = false;
  employeeSalaryForm: UntypedFormGroup;
   plateformes :any
  totalHT:any=0
  totalTTC:any=0

  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public holidayService: HolidayService,
    private snackBar: MatSnackBar,
    public employeesService: EmployeesService,
    private fb: UntypedFormBuilder

    
  ) {
        this.employeeSalaryForm = this.createEmployeeSalaryForm();

  }

  ngOnInit() {
   // this.loadData();
    this.loadPersonne()
  }

  private createEmployeeSalaryForm(): UntypedFormGroup {

   // console.log("La date",this.employeeSalaryForm.get('datemonitoring')?.value)
    return this.fb.group({
     
     plateformeId: [''],
     
      

    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
   // this.loadData();
   

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

  loadPersonne() {
     this.employeesService.getPersonneByUserId().subscribe({
       next: (data:any) => {
         this.plateformes = data;
         
         
         
       },
       error: (err) => console.error(err),
     });
   }

  loadData(idPersonne:string) {
     this.isLoading = true;
    this.holidayService.getAllTransactionByPlateforme(idPersonne).subscribe({
      next: (data:any) => {
        console.log(data)
        this.dataSource.data = data.transactions;
        this.totalHT=data.totalMontantTransactions
        this.totalTTC=data.totalMontantTransactionsTTC
        this.isLoading = false;
        this.refreshTable();
        console.log(this.dataSource.data)
     this.dataSource.filterPredicate = (data: Transaction, filter: string): boolean => {
      const searchText = filter.toLowerCase();
      return (
        (data.plateforme?.toLowerCase().includes(searchText) ?? false) ||
        (data.motif?.toLowerCase().includes(searchText) ?? false) ||
        (data.montant?.toString().toLowerCase().includes(searchText) ?? false) ||
        (data.api?.toLowerCase().includes(searchText) ?? false) ||
        (data.heure?.toLowerCase().includes(searchText) ?? false) ||
        (data.numero?.toLowerCase().includes(searchText) ?? false) ||
        (data.date ? new Date(data.date).toLocaleDateString('fr-FR').includes(searchText) : false)
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
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(AuthoritesFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { allHoliday: data, action },
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
          `${action === 'add' ? 'Add' : 'Edit'} Record Successfully...!!!`,
          'bottom',
          'center'
        );
      }
    });
  }

  private updateRecord(updatedRecord: Transaction) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id === updatedRecord.id
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: Transaction) {
    const dialogRef = this.dialog.open(AllHolidaysDeleteComponent, {
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
       'Personne': x.plateforme,
      'Montant': x.montant,
      Api: x.api,
        Motif: x.motif,
         Numero: x.numero,
         
      Heure: x.heure,
      Date: formatDate(new Date(x.date), 'dd-MM-yyyy', 'fr') || ''
      
     
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
