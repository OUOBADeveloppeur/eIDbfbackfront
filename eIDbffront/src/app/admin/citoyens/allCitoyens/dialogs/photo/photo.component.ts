import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { EmployeesService } from '../../employees.service';
import { environment } from 'environments/environment.development';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  imports:[   MatDialogContent,MatIconModule,CommonModule]
})
export class PhotoUploadModalComponent {
  selectedFile: File | null = null;
  iu: string;
  currentPhotoUrl: string;

  constructor(
    public dialogRef: MatDialogRef<PhotoUploadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { iu: string},
    private employeeService: EmployeesService
  ) {
    this.iu = data.iu;
    this.currentPhotoUrl = environment+"personnes/photo/"+this.iu || 'assets/avatar-default.png';
    console.log("data : ",this.iu)
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

    this.employeeService.uploadPhoto(this.iu, formData).subscribe({
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
