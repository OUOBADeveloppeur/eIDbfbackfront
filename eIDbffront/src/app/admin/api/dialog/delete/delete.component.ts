import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from 'app/admin/admin/all-admin/admin.service';

export interface DialogData {
  id: string;
  name: string;
 
}

@Component({
    selector: 'app-all-admin-delete',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss'],
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
    ]
})
export class AllApiDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<AllApiDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public adminService: AdminService
  ) {}

  confirmDelete(): void {
    this.adminService.deleteApi(this.data.id).subscribe({
      next: (response) => {
        // console.log('Delete Response:', response);
        this.dialogRef.close(response); // Close with the response data
        // Handle successful deletion, e.g., refresh the table or show a notification
      },
      error: (error) => {
        console.error('Erreur de suppression:', error);
        // Handle the error appropriately
        // Optionnellement afficher un message d'erreur à l'utilisateur
      },
    });
  }
}