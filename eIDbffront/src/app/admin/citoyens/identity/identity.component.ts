import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { environment } from 'environments/environment.development';
import { EmployeesService } from '../allCitoyens/employees.service';

@Component({
  selector: 'app-documents',
    imports: [
        MatButtonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatDividerModule,
        MatCardModule,
        MatChipsModule,
        CommonModule
    ],
  templateUrl: './identity.component.html',
  styleUrl: './identity.component.scss'
})
export class IdentityComponent {


  documents :any=[];
  nomComplet:string=''
    iu:string=''
    data:any

  defaultPhoto = 'assets/images/bf.png'; // ton image par défaut
  photoBase:string=environment.apiUrl+"documents/photo/"

    photoUrl:string=environment.apiUrl+"personnes/photo/"

  constructor(private route: ActivatedRoute,    
    public employeesService: EmployeesService,
  ) {}

ngOnInit(): void {
  const token = this.route.snapshot.paramMap.get('token');
  const signature = this.route.snapshot.paramMap.get('signature');

      console.log('Token reçu :', token);
      console.log('Signature reçue :', signature);


  if (token && signature) {
    // mode édition

    this.loadIdentity(token, signature);
    //this.loadDocument(+id);
   // console.log('Token reçu :', token);
  } else {
    // mode ajout
  }
}
onImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = this.defaultPhoto;
}

loadIdentity(token:string, signature:string){
   this.employeesService.getCitoyenIdentity(token, signature).subscribe({
        next: (data:any) => {
          
          console.log(data)
        this.documents=data.documentsValides
        this.data=data
         this.nomComplet=data['nom']+" "+data['prenom']
         this.iu=data.iu
        },
        error: (err) => console.error(err),
      });
}

loadCitoyen(id:number){
   this.employeesService.getCitoyenById(id).subscribe({
        next: (data:any) => {
          
          //console.log(data)
          this.nomComplet=data['nom']+" "+data['prenom']
          
        },
        error: (err) => console.error(err),
      });
}

}
