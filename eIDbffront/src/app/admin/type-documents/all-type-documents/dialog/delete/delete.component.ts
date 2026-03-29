import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { TypeDocumentService } from '../../type-document.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  libelle: string;
}

@Component({
    selector: 'app-type-document-delete',
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
export class TypeDocumentDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<TypeDocumentDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public typeDocumentService: TypeDocumentService
  ) {}

  confirmDelete(): void {
    this.typeDocumentService.deleteTypeDocument(this.data.id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Delete Error:', error);
      },
    });
  }
}
