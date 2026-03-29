import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from '@core/service/auth.service';
import { Api } from '../../api.model';
import { environment } from 'environments/environment.development';



export interface DialogData {

  api:Api
  
}
@Component({
  selector: 'app-logo',
imports: [
 
    CommonModule,
    ReactiveFormsModule, // 👈 à ajouter ici
    HttpClientModule,
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDialogClose,
  ],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})



export class LogoComponent {

name:string
  imageForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(  public dialogRef: MatDialogRef<LogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder, private http: HttpClient,private authService: AuthService ) {
    this.imageForm = this.fb.group({});
    this.name=data.api.name
  }

  onFileSelected(event: any): void {
    console.log("id recu ",this.data.api.id)
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Aperçu de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

 onSubmit(): void {
  if (!this.selectedFile) return;

  const formData = new FormData();
  formData.append('file', this.selectedFile);
  formData.append('apiId', this.data.api.id);

  

  this.http.post(environment.apiUrl+'logos/upload', formData, {
    headers: {
      Authorization: `Bearer ${this.authService.currentUserValue.token}`
    }
  }).subscribe({
    next: (res) =>   this.dialogRef.close(res),
    error: (err) => console.error('Erreur upload', err),
  });
}

}
