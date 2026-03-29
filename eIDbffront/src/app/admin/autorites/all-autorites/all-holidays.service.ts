import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import {  Authorite } from './all-holidays.model';
import { environment } from 'environments/environment.development';
import { AuthService } from '@core/service/auth.service';
import { Transaction } from './transaction.model';
import { aU } from '@fullcalendar/core/internal-common';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private readonly API_URL = 'assets/data/holidays.json';
  private dataChange: BehaviorSubject<Authorite[]> = new BehaviorSubject<
    Authorite[]
  >([]);
  token: string;

  constructor(private httpClient: HttpClient,private authService: AuthService) {
            this.token='Basic ' + window.btoa(environment.username + ":" + environment.password);
    
  }

  get data(): Authorite[] {
    return this.dataChange.value;
  }

  /** GET: Fetch all holidays */
  getAuthorites(): Observable<Authorite[]> {
    return this.httpClient.get<Authorite[]>(this.API_URL).pipe(
      map((holidays) => {
        this.dataChange.next(holidays); // Update the data change observable
        return holidays;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new holiday */
  addHoliday(holiday: Authorite): Observable<Authorite> {
    return this.httpClient.post<Authorite>(this.API_URL, holiday).pipe(
      map(() => {
        return holiday; // Return the newly added holiday
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing holiday */
  updateHoliday(holiday: Authorite): Observable<Authorite> {
    return this.httpClient.put<Authorite>(`${this.API_URL}`, holiday).pipe(
      map(() => {
        return holiday; // Return the updated holiday
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a holiday by ID */
  deleteHoliday(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // Return the ID of the deleted holiday
      }),
      catchError(this.handleError)
    );
  }



      updateAutorite(autorite: Authorite): Observable<Authorite> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authService.currentUserValue.token
      });
  
      const userData = {
       
         libelle:autorite.libelle,
        email:autorite.email,
        adresse:autorite.adresse,
        siteWeb: autorite.siteWeb,
        telephone: autorite.telephone,
       
      };

     // console.log("Le user envoyé============> ",userData)
  
      return this.httpClient
        .put<any>(environment.apiUrl + "autorites/update/"+autorite.id,JSON.stringify(userData) , { headers })
        .pipe(
          map((response) => new Authorite({
            id: response.id || autorite.id
           
          })),
          catchError(this.handleError)
        );
    }

 getAllAuthorities(): Observable<Authorite[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authService.currentUserValue.token
    });

    return this.httpClient.get<Authorite[]>(environment.apiUrl + "autorites/all", { headers });
  }

   getAllTransactionByPlateforme(idPlateforme:string): Observable<Transaction[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authService.currentUserValue.token
    });

    return this.httpClient.get<Transaction[]>(environment.apiUrl + "transaction/by-plateforme/"+idPlateforme, { headers });
  }
    addAutorite(autorite: Authorite): Observable<Authorite> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authService.currentUserValue.token
      });
  
      const userData = {
        libelle:autorite.libelle,
        email:autorite.email,
        adresse:autorite.adresse,
        siteWeb: autorite.siteWeb,
        telephone: autorite.telephone,
       
      
       
      };

     // console.log("Le domaine envoyé============> ",userData)
  
      return this.httpClient
        .post<any>(environment.apiUrl + "autorites/creer",JSON.stringify(userData) , { headers })
        .pipe(
          map((response) => new Authorite({
            id: response.id || autorite.id,
           
          })),
          catchError(this.handleError)
        );
    }


       deleteAutorite(id: number): Observable<Authorite> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authService.currentUserValue.token
      });
  
    

     // console.log("Le user envoyé============> ",userData)
  
      return this.httpClient
        .delete<any>(environment.apiUrl + "autorites/delete/"+id, { headers })
        .pipe(
          map((response) => new Authorite({
            id: response.id || id
           
           
           // role: response.role || admin.role,
          
          })),
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
