import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AdminService } from '../../admin.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  role: string;
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
export class AllAdminDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<AllAdminDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public adminService: AdminService
  ) {}

  confirmDelete(): void {
    this.adminService.deleteAdmin(this.data.id).subscribe({
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