import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'environments/environment.development';
import { PhotoUploadModalComponent } from '../../allCitoyens/dialogs/photo/photo.component';
import { EmployeesService } from '../../allCitoyens/employees.service';

@Component({
  selector: 'app-document-photo-dialogue',
  imports:[MatDialogContent,MatIconModule,CommonModule],
  templateUrl: './document-photo-dialogue.component.html',
  styleUrl: './document-photo-dialogue.component.scss'
})
export class DocumentPhotoDialogueComponent {

    selectedFile: File | null = null;
  id: any;
  currentPhotoUrl: string;

  constructor(
    public dialogRef: MatDialogRef<PhotoUploadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string},
    private employeeService: EmployeesService
  ) {
    this.id = data.id;
    this.currentPhotoUrl = environment+"personnes/photo/"+this.id || 'assets/avatar-default.png';
    console.log("data : ",this.id)
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadPhoto() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.employeeService.uploadDocumentPhoto(this.id, formData).subscribe({
      next: (res: any) => {
        // Retourne la nouvelle URL au parent
        this.dialogRef.close(res.photoUrl);
      },
      error: (err) => console.error('Erreur upload photo:', err)
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
