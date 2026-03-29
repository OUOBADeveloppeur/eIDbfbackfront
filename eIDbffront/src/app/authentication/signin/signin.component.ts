import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Role, AuthService } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Admin } from '@core/models/admin';
import { Beneficiaire } from '@core/models/beneficiaire';
import { Employe } from '@core/models/employe';
import { AuthModel } from '@core/models/authModel';
@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    imports: [
        RouterLink,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
    ]
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;

  adminMode=true
  employeMode=false
  beneficiaireMode=false


  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['aristide', Validators.required],
      password: ['aristide123', Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  adminSet() {
    this.authForm.get('username')?.setValue('admin');
    this.authForm.get('password')?.setValue('admin');
    this.adminMode=true
    this.employeMode=false
    this.beneficiaireMode=false
  }
  employeeSet() {
    this.authForm.get('username')?.setValue('ouedraogoaris@gmail.com');
    this.authForm.get('password')?.setValue('2885351');
    this.adminMode=false
    this.employeMode=true
    this.beneficiaireMode=false
  }
  clientSet() {
    this.authForm.get('username')?.setValue("ouedraogoaris@gmail.com");
    this.authForm.get('password')?.setValue('2885351');
     this.adminMode=false
    this.employeMode=false
    this.beneficiaireMode=true
    
  }


 /* onSubmitOld(){
    if(this.adminMode){
      this.onSubmitAdmin()
    }
     else if (this.beneficiaireMode){
      this.onSubmitBeneficiaire()
    }
    /*else if(this.employeMode){
      this.onSubmitEmploye()
    }
   
  }*/

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = "Nom d'utilisateur et mot de passe non valides !";
      return;
    } else {
      this.subs.sink = this.authService .login(this.f['username'].value, this.f['password'].value).subscribe({
      next: (response:any) => {
        
          // this.loading = false;
          console.log(response)
          this.authService.token=response.token
           let role=""
           if(response.authorities[0].authority.split("_")[1]=="ADMIN"){
            role="Admin"

           }
           else if(response.authorities[0].authority.split("_")[1]=="USER"){
            role="Client"
           }

         let admin:AuthModel={
         
          "token":response.token,
          "type":response.type,
          "role":role,
            "username":response.username,
            "userId":response.userId

        
        }
        console.log("Admin====> ",admin)
         localStorage.setItem('currentUser', JSON.stringify(admin));
         this.authService.setCurrentUser(admin);
         setTimeout(() => {
                   this.router.navigate(['/admin/dashboard/main']);

         }, 3000);
      
     
      },
      error: (error) => {
           this.loading = false;
        console.error('Erreur :', error)}
    });


    }
  }

    onSubmitEmploye() {
    this.submitted = true;
    this.loading = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = "Nom d'utilisateur et mot de passe non valides !";
      return;
    } else {
      this.subs.sink = this.authService .loginEmploye(this.f['username'].value, this.f['password'].value).subscribe({
      next: (response:any) => {
          // this.loading = false;

          

          this.authService.token=response.token


          let employe:Employe={
          "id":response.id,
          "nom":response.nom,
          "prenom":response.prenom,
          "role":response.role,
          "telephone":response.phone,
          "email":response.email
          
        }
        localStorage.setItem('currentUser', JSON.stringify(employe));
        this.router.navigate(['/employee/dashboard']);

        /*  setTimeout(() => {
                const role = employe.role;

                console.log("Le role ====>",role)
                if (role === Role.All || role === Role.Admin) {
                  this.router.navigate(['/admin/dashboard/main']);
                } else if (role === Role.Employee) {
                  this.router.navigate(['/employee/dashboard']);
                } else if (role === Role.Client) {
                  this.router.navigate(['/client/dashboard']);
                } else {
                  this.router.navigate(['/authentication/signin']);
                }
                this.loading = false;
              }, 1000);*/
        console.log('Succès :', response)
        
       
           
      },
      error: (error) => {
           this.loading = false;
        console.error('Erreur :', error)}
    });


    }
  }

    onSubmitBeneficiaire() {
    this.submitted = true;
    this.loading = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = "Nom d'utilisateur et mot de passe non valides !";
      return;
    } else {
      this.subs.sink = this.authService .login(this.f['username'].value, this.f['password'].value).subscribe({
      next: (response:any) => {
          // this.loading = false;
          console.log(response)

          this.authService.token=response.token

           let role=""
           if(response.authorities[0].authority.split("_")[1]=="ADMIN"){
            role="Admin"

           }
           else if(response.authorities[0].authority.split("_")[1]=="USER"){
            role="Client"
           }

         let admin:AuthModel={
         
          "token":response.token,
          "type":response.type,
          "role":role,
            "username":response.username,
            "userId":response.userId

        
        }

        localStorage.setItem('currentUser', JSON.stringify(admin));
        this.authService.setCurrentUser(admin);

        setTimeout(() => {
                  this.router.navigate(['/client/dashboard']);

        }, 3000);

          /*setTimeout(() => {
                const role = beneficiaire.role;

                console.log("Le role ====>",role)
                if (role === Role.All || role === Role.Admin) {
                  this.router.navigate(['/admin/dashboard/main']);
                } else if (role === Role.Employee) {
                  this.router.navigate(['/employee/dashboard']);
                } else if (role === Role.Client) {
                  this.router.navigate(['/client/dashboard']);
                } else {
                  this.router.navigate(['/authentication/signin']);
                }
                this.loading = false;
              }, 1000);*/
        console.log('Succès :', response)
        
       
           
      },
      error: (error) => {
           this.loading = false;
        console.error('Erreur :', error)}
    });


    }
  }
}
