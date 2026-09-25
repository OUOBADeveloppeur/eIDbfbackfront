import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import  {Admin} from '../models/admin'
import { Role } from '@core/models/role';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  public token: any;


  private users = [
    {
      id: 1,
      img: 'assets/images/user/admin.jpg',
      username: 'admin@software.com',
      password: 'admin@123',
      firstName: 'Sarah',
      lastName: 'Smith',
      role: Role.Admin,
      token: 'admin-token',
    },
    {
      id: 2,
      img: 'assets/images/user/employee.jpg',
      username: 'employee@software.com',
      password: 'employee@123',
      firstName: 'Ashton',
      lastName: 'Cox',
      role: Role.Employee,
      token: 'employee-token',
    },
    {
      id: 3,
      img: 'assets/images/user/client.jpg',
      username: 'client@software.com',
      password: 'client@123',
      firstName: 'Cara',
      lastName: 'Stevens',
      role: Role.Client,
      token: 'client-token',
    },
  ];

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
    //this.token='Basic ' + window.btoa(environment.username + ":" + environment.password);
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public setCurrentUser(user: any) {
    this.currentUserSubject.next(user);
  }

  login(username: string, password: string) {
     let headers= new HttpHeaders({
      'Content-Type': 'application/json'
     

  })
  

    const body = JSON.stringify( {
      // tes données à envoyer
      username: username,
      password: password
    });


    console.log('Headers:', headers);
    console.log('Body:', body);
    console.log('URL:', environment.apiUrl + 'auth/signin');

    return this.http.post(environment.apiUrl+"auth/signin", body, {
    headers: headers
  });

   
  }

  /* const user = this.users.find((u) => u.username === username && u.password === password);

    if (!user) {
      return this.error("Nom d'utilisateur ou mot de passe incorrect");
    } else {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return this.ok({
        id: user.id,
        img: user.img,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        token: user.token,
      });
    }*/

   loginEmploye(username: string, password: string) {
    let headers= new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization:this.token

  })
  

    const body = JSON.stringify( {
      // tes données à envoyer
      email: username,
      password: password
    });


    console.log('Headers:', headers);
    console.log('Body:', body);
    console.log('URL:', environment.apiUrl + 'loginUser');

    return this.http.post(environment.apiUrl+"loginUser", body, {
    headers: headers
  });

  }

   loginBeneficiaire(username: string, password: string) {

       let headers= new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization:this.token

  })
  

    const body = JSON.stringify( {
      // tes données à envoyer
      email: username,
      password: password
    });


    console.log('Headers:', headers);
    console.log('Body:', body);
    console.log('URL:', environment.apiUrl + 'loginAdmin');

    return this.http.post(environment.apiUrl+"loginBeneficiaire", body, {
    headers: headers
  });

  }


  ok(body?: {
    id: number;
    img: string;
    username: string;
    firstName: string;
    lastName: string;
    token: string;
  }) {
    return of(new HttpResponse({ status: 200, body }));
  }
  error(message: string) {
    return throwError(message);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }
}

