import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Personne } from './employees.model';
import { environment } from 'environments/environment';
import { AuthService } from '@core/service/auth.service';
import { reference } from '@popperjs/core';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private readonly API_URL = 'assets/data/employees.json';
  token: string;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.token = 'Basic ' + window.btoa(environment.username + ":" + environment.password);

  }

  /** GET: Récupérer tous les employés */
  getPersonne2(): Observable<Personne[]> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token
    })

    return this.httpClient
      .get<Personne[]>(environment.apiUrl + "users", { headers: headers })
      .pipe(
        map((data: any[]) =>

          data.map(item => new Personne(item))
        ),
        catchError(this.handleError)
      );
  }

  getCitoyen(): Observable<Personne[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    return this.httpClient.get<Personne[]>(environment.apiUrl + "personnes/all", { headers });
  }

  getTypeDoc(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    return this.httpClient.get<any[]>(environment.apiUrl + "typedocuments/all", { headers });
  }

  getAutorite(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    return this.httpClient.get<any[]>(environment.apiUrl + "autorites/all", { headers });
  }


  getCitoyenDocument(id: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    return this.httpClient.get<any[]>(environment.apiUrl + "documents/personnes/" + id + "/documents", { headers });
  }


  getCitoyenIdentity(token: string, signature: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    return this.httpClient.get<any[]>(environment.apiUrl + "qrcodes/verify?token=" + token + "&signature=" + signature, { headers });
  }
  getCitoyenById(id: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    return this.httpClient.get<any[]>(environment.apiUrl + "personnes/getById/" + id, { headers });
  }
  getStat(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    return this.httpClient.get<any>(environment.apiUrl + "stats/counts", { headers });
  }

  getPersonneByUserId(): Observable<Personne[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    return this.httpClient.get<Personne[]>(environment.apiUrl + "Personne/user/" + this.authService.currentUserValue.userId, { headers });
  }

  sendMail(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    return this.httpClient.get<any>(environment.apiUrl + "sendmail/" + id, { headers });
  }
  /** POST: Ajouter un nouvel employé */



  uploadPhoto(iu: any, formData: any) {
    const headers = new HttpHeaders({

      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    return this.httpClient.post<any>(environment.apiUrl + "personnes/" + iu + "/photo", formData, { headers })


  }

  uploadDocumentPhoto(id: any, formData: any) {
    const headers = new HttpHeaders({

      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    return this.httpClient.post<any>(environment.apiUrl + "documents/upload/" + id, formData, { headers })


  }

  updatePersonne(personne: Personne): Observable<Personne> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    const PersonneData = {


      nom: personne.nom,
      prenom: personne.prenom,
      dateNaissance: personne.dateNaissance,
      sexe: personne.sexe,
      nationalite: personne.nationalite,
      telephone: personne.telephone,
      email: personne.email,
      adresse: personne.adresse,


      lieuNaissance: personne.lieuNaissance,

      etat: personne.etat,
      agent: personne.agentString=="Oui" ? true : false



    };

    console.log("Personne envoyé============> ", PersonneData)
    console.log("Token envoyé============> ", this.authService.currentUserValue.token)


    return this.httpClient
      .put<any>(environment.apiUrl + "personnes/update/" + personne.id, JSON.stringify(PersonneData), { headers })
      .pipe(
        map((response) => new Personne({

          nom: response.nom,
          prenom: response.prenom,
          dateNaissance: response.dateNaissance,
          sexe: response.sexe,
          nationalite: response.nationalite,
          telephone: response.telephone,
          email: response.email,
          adresse: response.adresse,
          photo: response.photo,
          iu: response.iu,
          lieuNaissance: response.lieuNaissance,

          etat: response.etat

        })),
        catchError(this.handleError)
      );
  }



  updateDocument(document: any, id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    const PersonneData = {

      numero: { nip: document.numero, reference: document.reference },
      dateDelivrance: document.dateDelivrance,
      dateExpiration: document.dateExpiration,

      lieuEtablissement: document.lieuEtablissement,

      contenu: document.contenu,

      typeDocument: { id: +document.typeDocument },
      autorite: { id: +document.autorite },



      taille: +document.taille







    };

    console.log("Personne envoyé============> ", PersonneData)

    return this.httpClient
      .put<any>(environment.apiUrl + "documents/update/" + id, JSON.stringify(PersonneData), { headers })
      .pipe(
        map((response) => ({
          id: response.id
        })),
        catchError(this.handleError)
      );
  }

  addDocument(document: any, personneId: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    const PersonneData = {

      numero: { nip: document.numero, reference: document.reference },
      dateDelivrance: document.dateDelivrance,
      dateExpiration: document.dateExpiration,

      lieuEtablissement: document.lieuEtablissement,

      contenu: document.contenu,

      typeDocument: { id: +document.typeDocument },
      autorite: { id: +document.autorite },
      personneId: personneId,


      taille: +document.taille







    };

    console.log("Personne envoyé============> ", PersonneData)

    return this.httpClient
      .post<any>(environment.apiUrl + "documents/creer", JSON.stringify(PersonneData), { headers })
      .pipe(
        map((response) => ({
          id: response.id
        })),
        catchError(this.handleError)
      );
  }

  addPersonne(personne: Personne): Observable<Personne> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    const PersonneData = {


      nom: personne.nom,
      prenom: personne.prenom,
      dateNaissance: personne.dateNaissance,
      sexe: personne.sexe,
      nationalite: personne.nationalite,
      telephone: personne.telephone,
      email: personne.email,
      adresse: personne.adresse,
      photo: personne.photo,

      lieuNaissance: personne.lieuNaissance,




    };

    console.log("Personne envoyé============> ", PersonneData)

    return this.httpClient
      .post<any>(environment.apiUrl + "personnes/creer", JSON.stringify(PersonneData), { headers })
      .pipe(
        map((response) => new Personne({
          id: response.id,
          nom: response.nom,
          prenom: response.prenom,
          dateNaissance: response.dateNaissance,
          sexe: response.sexe,
          nationalite: response.nationalite,
          telephone: response.telephone,
          email: response.email,
          adresse: response.adresse,
          photo: response.photo,
          iu: response.iu,
          lieuNaissance: response.lieuNaissance,

          etat: response.etat


        })),
        catchError(this.handleError)
      );
  }



  deleteDocument(id: string): Observable<Personne> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });


    return this.httpClient
      .delete<any>(environment.apiUrl + "documents/delete/" + id, { headers })
      .pipe(
        map((response) => new Personne({
          id: response.id



        })),
        catchError(this.handleError)
      );
  }
  deletePersonne(id: string): Observable<Personne> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });


    return this.httpClient
      .delete<any>(environment.apiUrl + "personnes/delete/" + id, { headers })
      .pipe(
        map((response) => new Personne({
          id: response.id



        })),
        catchError(this.handleError)
      );
  }

  /*addEmployee2(employee: Employees): Observable<Employees> {
    return this.httpClient.post<Employees>(this.API_URL, employee).pipe(
      map(() => {
        return employee; // retourner l'employé nouvellement ajouté
      }),
      catchError(this.handleError)
    );
  }*/

  /** PUT: Mettre à jour un employé existant */
  /* updateEmployee2(employee: Employees): Observable<Employees> {
     return this.httpClient.put<Employees>(`${this.API_URL}`, employee).pipe(
       map(() => {
         return employee; // retourner l'employé mis à jour
       }),
       catchError(this.handleError)
     );
   }*/

  /** DELETE: Supprimer un employé par ID */
  /*deleteEmployee2(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // retourner l'ID de l'employé supprimé
      }),
      catchError(this.handleError)
    );
  }

  */

  /** Gérer les erreurs d'opération Http qui ont échoué */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Une erreur s\'est produite:', error.message);
    return throwError(
      () => new Error('Quelque chose s\'est mal passé; veuillez réessayer plus tard.')
    );
  }
}
