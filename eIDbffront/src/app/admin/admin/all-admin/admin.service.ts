import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Admin } from './admin.model';
import { environment } from 'environments/environment.development';
import { AuthService } from '@core/service/auth.service';
import { Api } from 'app/admin/api/api.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly API_URL = 'assets/data/admins.json';
  token: string;

  constructor(private httpClient: HttpClient,  private authService: AuthService) {
    this.token = 'Basic ' + window.btoa(environment.username + ":" + environment.password);
  }

  /** GET: Récupérer tous les administrateurs */
  getAllAdmins(): Observable<Admin[]> {
    console.log("Bearer "+this.authService.currentUserValue.token)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authService.currentUserValue.token
    });

    return this.httpClient.get<Admin[]>(environment.apiUrl + "users/liste", { headers });
  }

    getAllApi(): Observable<Api[]> {
    console.log("Bearer "+this.authService.currentUserValue.token)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authService.currentUserValue.token
    });

    return this.httpClient.get<Api[]>(environment.apiUrl + "api/liste", { headers });
  }

    envoyerTransaction(data: any) {
    const headers = new HttpHeaders({
      'Authorization': "Bearer "+this.authService.currentUserValue.token,
      'Content-Type': 'application/json',
      'Accept': 'text/html' // important si le backend retourne du HTML
    });

    return this.httpClient.post(environment.apiUrl+'payment', data, {
      headers,
      responseType: 'blob' // car on veut du contenu HTML qu'on peut ouvrir
    });
  }
   getAllUsers(): Observable<Admin[]> {
    console.log("Bearer "+this.authService.currentUserValue.token)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authService.currentUserValue.token
    });

    return this.httpClient.get<Admin[]>(environment.apiUrl + "user/users", { headers });
  }

    getRoles(): Observable<any[]> {
    console.log("Bearer "+this.authService.currentUserValue.token)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authService.currentUserValue.token
    });

    return this.httpClient.get<any[]>(environment.apiUrl + "roles/liste", { headers });
  }

  /** POST: Ajouter un nouvel administrateur */
  addAdmin(admin: Admin): Observable<Admin> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
     'Authorization': "Bearer "+this.authService.currentUserValue.token
    });

    const adminData = {
      username: admin.username,
      password: admin.password,
      nom: admin.nom,
      prenom: admin.prenom,
      roles: [{ "id": admin.roleid }] ,
      telephone: admin.telephone
    };
    console.log(adminData)

    return this.httpClient
      .post<any>(environment.apiUrl + "users/creer",JSON.stringify(adminData) , { headers })
      .pipe(
        map((response) => new Admin({
          id: response.id || admin.id,
          username: response.username || admin.username,
          password: response.password || admin.password,
          nom: response.nom || admin.nom,
          prenom: response.prenom || admin.prenom,
         // role: response.role || admin.role,
          telephone: response.telephone || admin.telephone
        })),
        catchError(this.handleError)
      );
  }


    addApi(api: Api): Observable<Api> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
     'Authorization': "Bearer "+this.authService.currentUserValue.token
    });

    const adminData = {
      name: api.name,
      commission: api.commission,
      description: api.description,
      logoUrl: "",
     
    };
    console.log(adminData)

    return this.httpClient
      .post<any>(environment.apiUrl + "api/creer",JSON.stringify(adminData) , { headers })
      .pipe(
        map((response) => new Api({
          id: response.id || api.id,
          name: response.name || api.name,
          logoUrl: response.logoUrl || api.logoUrl,
          description: response.description || api.description,
          commission: response.commission || api.commission
        })),
        catchError(this.handleError)
      );
  }
    updateApi(api: Api): Observable<Api> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
     'Authorization': "Bearer "+this.authService.currentUserValue.token
    });

    const adminData = {
      id:api.id,
      name: api.name,
      commission: api.commission,
      description: api.description,
      logoUrl: api.logoUrl,
     
    };
    console.log(adminData)

    return this.httpClient
      .put<any>(environment.apiUrl + "api/update/"+api.id,JSON.stringify(adminData) , { headers })
      .pipe(
        map((response) => new Api({
          id: response.id || api.id,
          name: response.name || api.name,
          logoUrl: response.logoUrl || api.logoUrl,
          description: response.description || api.description,
          commission: response.commission || api.commission
        })),
        catchError(this.handleError)
      );
  }


   deleteApi(id: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authService.currentUserValue.token
    });

   
    return this.httpClient
      .delete<void>(`${environment.apiUrl}api/delete/`+id)
      .pipe(
        map(() => id),
        catchError(this.handleError)
      );
  }
  /** PUT: Mettre à jour un administrateur existant */
  updateAdmin(admin: Admin): Observable<Admin> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
       'Authorization': "Bearer "+this.authService.currentUserValue.token
    });

    const adminData = {
      id: admin.id,
      username: admin.username,
      password:admin.password,

      nom: admin.nom,
      prenom: admin.prenom,
      role:admin.role,
      roleid:admin.roleid,
       roles: [{ "id": admin.roleid }] ,
      telephone: admin.telephone
    };

    console.log(adminData)

    return this.httpClient
      .put<any>(`${environment.apiUrl}users/update/`+admin.id, adminData, { headers })
      .pipe(
        map((response) => new Admin({
          id: response.id || admin.id,
          username: response.username || admin.username,
          password: response.password || admin.password,
          nom: response.nom || admin.nom,
          prenom: response.prenom || admin.prenom,
          role: response.role || admin.role,
          telephone: response.telephone || admin.telephone
        })),
        catchError(this.handleError)
      );
  }

    updateAdminPassword(admin: Admin,id:number): Observable<Admin> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
       'Authorization': "Bearer "+this.authService.currentUserValue.token
    });

    const adminData = {
     
      password:admin.password,

     
    };

    console.log(adminData)

    return this.httpClient
      .put<any>(`${environment.apiUrl}users/update/password/`+id, adminData, { headers })
      .pipe(
        map((response) => new Admin({
          id: response.id || admin.id,
          username: response.username || admin.username,
          password: response.password || admin.password,
          nom: response.nom || admin.nom,
          prenom: response.prenom || admin.prenom,
          role: response.role || admin.role,
          telephone: response.telephone || admin.telephone
        })),
        catchError(this.handleError)
      );
  }

  /** DELETE: Supprimer un administrateur par ID */
  deleteAdmin(id: number): Observable<number> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authService.currentUserValue.token
    });

   
    return this.httpClient
      .delete<void>(`${environment.apiUrl}users/delete/`+id)
      .pipe(
        map(() => id),
        catchError(this.handleError)
      );
  }

  /** Gérer les erreurs d'opération Http qui ont échoué */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Une erreur s\'est produite:', error.message);
    return throwError(
      () => new Error('Quelque chose s\'est mal passé; veuillez réessayer plus tard.')
    );
  }
}