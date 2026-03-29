import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Clients } from './clients.model';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private readonly API_URL = 'assets/data/clients.json';
  token: string;

  constructor(private httpClient: HttpClient) {
    this.token = 'Basic ' + window.btoa(environment.username + ":" + environment.password);
  }

  /** GET: Récupérer tous les bénéficiaires */
  getAllClients(): Observable<Clients[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

    return this.httpClient.get<Clients[]>(environment.apiUrl + "beneficiaires", { headers });
  }

  /** POST: Ajouter un nouveau bénéficiaire */
  addClient(client: Clients): Observable<Clients> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

    // Transformer le client en bénéficiaire pour l'API
    const beneficiaire = {
      nom: client.nom,
      prenom: client.prenom,
      password: client.password,
      email: client.email,
      telephone: client.telephone,
      structure: client.structure,
      role: 3
    };

    return this.httpClient
      .post<any>(environment.apiUrl + "addBeneficiaire", beneficiaire, { headers })
      .pipe(
        map((response) => new Clients({
          id: response.id || client.id,
          nom: response.nom || client.nom,
          prenom: response.prenom || client.prenom,
          email: response.email || client.email,
          telephone: response.telephone || client.telephone,
          structure: response.structure || client.structure
          
        })),
        catchError(this.handleError)
      );
  }

  /** PUT: Mettre à jour un bénéficiaire existant */
  updateClient(client: Clients): Observable<Clients> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

    const beneficiaire = {
      id: client.id,
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      structure: client.structure
     
    };

    return this.httpClient
      .post<any>(`${environment.apiUrl}update/beneficiaire`, beneficiaire, { headers })
      .pipe(
        map((response) => new Clients({
          id: response.id || client.id,
          nom: response.nom || client.nom,
          prenom: response.prenom || client.prenom,
          email: response.email || client.email,
          telephone: response.telephone || client.telephone,
          structure: response.structure || client.structure
         
        })),
        catchError(this.handleError)
      );
  }

  /** DELETE: Supprimer un bénéficiaire par ID */
  deleteClient(id: number): Observable<number> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

    const data=JSON.stringify({id:id})

    return this.httpClient
      .post<void>(`${environment.apiUrl}delete/beneficiaire`,data, { headers })
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