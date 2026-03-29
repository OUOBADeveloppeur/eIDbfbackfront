import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Leads } from './leads.model';
import { environment } from 'environments/environment.development';
import { Employe } from '@core/models/employe';
import { Personne } from '../citoyens/allCitoyens/employees.model';

@Injectable({
  providedIn: 'root',
})
export class LeadsService {
  private readonly API_URL = 'assets/data/leads.json';
  token: string;

  constructor(private httpClient: HttpClient) {
            this.token='Basic ' + window.btoa(environment.username + ":" + environment.password);
    
  }

  /** GET: Fetch all leads */
  getAllLeads2(): Observable<Leads[]> {
    return this.httpClient
      .get<Leads[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  getAllLeads(): Observable<Leads[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

    return this.httpClient.get<Leads[]>(environment.apiUrl+"all/chefDepartements", { headers });
  }

  /** POST: Add a new lead */
  addLeads2(leads: Leads): Observable<Leads> {
    return this.httpClient.post<Leads>(this.API_URL, leads).pipe(
      map(() => {
        return leads; // Return the newly added lead
      }),
      catchError(this.handleError)
    );
  }

      addLeads(leads: Leads): Observable<Personne> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.token
        });
    
        const userData = {
          departement_id:leads.departement,
          user_id:leads.chef
          
         
        };
  
        console.log("Le lead envoyé============> ",userData)
    
        return this.httpClient
          .post<any>(environment.apiUrl + "addChefDepartement",JSON.stringify(userData) , { headers })
          .pipe(
            map((response) => new Personne({
              id: response.id 
             
            })),
            catchError(this.handleError)
          );
      }
  




           updateLeads(leads: Leads): Observable<Personne> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.token
        });
    
        const userData = {
          departement_id:leads.departement,
          user_id:leads.chef,
          id:leads.id
          
         
        };
  
        console.log("Le lead envoyé============> ",userData)
    
        return this.httpClient
          .post<any>(environment.apiUrl + "update/chefDepartement",JSON.stringify(userData) , { headers })
          .pipe(
            map((response) => new Personne({
              id: response.id 
             
            })),
            catchError(this.handleError)
          );
      }
  
  /** PUT: Update an existing lead */
  updateLeads2(leads: Leads): Observable<Leads> {
    return this.httpClient
      .put<Leads>(`${this.API_URL}`, leads) // Ensure to use the correct endpoint as per your API
      .pipe(
        map(() => {
          return leads; // Return the updated lead
        }),
        catchError(this.handleError)
      );
  }


             deleteLeads(id: number): Observable<Personne> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.token
        });
    
        const userData = {
        
       
          id:id
          
         
        };
  
        console.log("Le lead envoyé============> ",userData)
    
        return this.httpClient
          .post<any>(environment.apiUrl + "delete/chefDepartement",JSON.stringify(userData) , { headers })
          .pipe(
            map((response) => new Personne({
              id: response.id 
             
            })),
            catchError(this.handleError)
          );
      }

  /** DELETE: Remove a lead by ID */
  deleteLeads2(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // Return the ID of the deleted lead
      }),
      catchError(this.handleError)
    );
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
