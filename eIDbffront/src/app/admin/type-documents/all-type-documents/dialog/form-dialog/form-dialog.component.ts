import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { TypeDocumentService } from '../../type-document.service';
import {
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TypeDocument } from '../../type-document.model';

export interface DialogData {
  id: number;
  action: string;
  typeDocument: TypeDocument;
}

@Component({
    selector: 'app-type-document-form',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogClose,
    ]
})
export class TypeDocumentFormComponent {
  action: string;
  dialogTitle: string;
  typeDocumentForm: UntypedFormGroup;
  typeDocument: TypeDocument;

  constructor(
    public dialogRef: MatDialogRef<TypeDocumentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public typeDocumentService: TypeDocumentService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    this.typeDocument =
      this.action === 'edit'
        ? data.typeDocument
        : new TypeDocument({} as TypeDocument);
    this.dialogTitle =
      this.action === 'edit' ? this.typeDocument.libelle : 'Nouveau type de document';
    this.typeDocumentForm = this.createForm();
  }

  private createForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.typeDocument.id],
      libelle: [this.typeDocument.libelle, [Validators.required]],
      description: [this.typeDocument.description, [Validators.required]],
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.typeDocumentForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Champ obligatoire';
    }
    return '';
  }

  submit(): void {
    if (this.typeDocumentForm.valid) {
      const formData = this.typeDocumentForm.getRawValue();

      if (this.action === 'edit') {
        this.typeDocumentService.updateTypeDocument(formData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
          },
        });
      } else {
        this.typeDocumentService.addTypeDocument(formData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Add Error:', error);
          },
        });
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
