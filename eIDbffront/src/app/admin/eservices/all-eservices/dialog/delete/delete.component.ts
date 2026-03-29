import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { EserviceService } from '../../all-eservices.service';

export interface DialogData {
  id: number;
  libelle: string;
 
  
}

@Component({
    selector: 'app-all-holidays-delete',
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
export class EserviceDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<EserviceDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public eserviceService: EserviceService
  ) {}
  confirmDelete(): void {
    this.eserviceService.deleteEservice(this.data.id).subscribe({
      next: (response) => {
        // console.log('Delete Response:', response);
        this.dialogRef.close(response); // Close with the response data
        // Handle successful deletion, e.g., refresh the table or show a notification
      },
      error: (error) => {
        console.error('Delete Error:', error);
        // Handle the error appropriately
      },
    });
  }
}
