import { Component, Inject } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EmployeesService } from '../../allCitoyens/employees.service';

export interface DialogData {
  id: string;
  typeDocument:{
    libelle: string;
  }
  

  
 
}

@Component({
  selector: 'app-delete-dialogue',
   imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
    ],
  templateUrl: './delete-dialogue.component.html',
  styleUrl: './delete-dialogue.component.scss'
})
export class DocumentDeleteDialogueComponent {


  
  constructor(
    public dialogRef: MatDialogRef<DocumentDeleteDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public employeesService: EmployeesService
  ) {
    console.log(data)
  }
  confirmDelete(): void {
   

    this.employeesService.deleteDocument(this.data.id).subscribe({
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
