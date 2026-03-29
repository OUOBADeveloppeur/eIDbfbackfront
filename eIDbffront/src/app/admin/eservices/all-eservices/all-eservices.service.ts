import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'environments/environment.development';
import { AuthService } from '@core/service/auth.service';
import { aU } from '@fullcalendar/core/internal-common';
import { Eservice } from './all-eservices.model';

@Injectable({
  providedIn: 'root',
})
export class EserviceService {
  private readonly API_URL = 'assets/data/holidays.json';
  private dataChange: BehaviorSubject<Eservice[]> = new BehaviorSubject<
    Eservice[]
  >([]);
  token: string;

  constructor(private httpClient: HttpClient,private authService: AuthService) {
            this.token='Basic ' + window.btoa(environment.username + ":" + environment.password);
    
  }

  get data(): Eservice[] {
    return this.dataChange.value;
  }

  /** GET: Fetch all holidays */
  getEservices(): Observable<Eservice[]> {
    return this.httpClient.get<Eservice[]>(this.API_URL).pipe(
      map((holidays) => {
        this.dataChange.next(holidays); // Update the data change observable
        return holidays;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new holiday */
  addHoliday(holiday: Eservice): Observable<Eservice> {
    return this.httpClient.post<Eservice>(this.API_URL, holiday).pipe(
      map(() => {
        return holiday; // Return the newly added holiday
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing holiday */
  updateHoliday(holiday: Eservice): Observable<Eservice> {
    return this.httpClient.put<Eservice>(`${this.API_URL}`, holiday).pipe(
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



      updateEservice(autorite: Eservice): Observable<Eservice> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authService.currentUserValue.token
      });
  
      const userData = {
       
         libelle:autorite.libelle,
        description:autorite.description,
        url:autorite.url,
       
       
      };

     // console.log("Le user envoyé============> ",userData)
  
      return this.httpClient
        .put<any>(environment.apiUrl + "eservices/update/"+autorite.id,JSON.stringify(userData) , { headers })
        .pipe(
          map((response) => new Eservice({
            id: response.id || autorite.id
           
          })),
          catchError(this.handleError)
        );
    }

 getAllEservices(): Observable<Eservice[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authService.currentUserValue.token
    });

    return this.httpClient.get<Eservice[]>(environment.apiUrl + "eservices/all", { headers });
  }

  
    addEservice(autorite: Eservice): Observable<Eservice> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authService.currentUserValue.token
      });
  
      const userData = {
        libelle:autorite.libelle,
        description:autorite.description,
        url:autorite.url,
     
       
      
       
      };

     // console.log("Le domaine envoyé============> ",userData)
  
      return this.httpClient
        .post<any>(environment.apiUrl + "eservices/creer",JSON.stringify(userData) , { headers })
        .pipe(
          map((response) => new Eservice({
            id: response.id || autorite.id,
           
          })),
          catchError(this.handleError)
        );
    }


       deleteEservice(id: number): Observable<Eservice> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      'Authorization': "Bearer "+this.authService.currentUserValue.token
      });
  
    

     // console.log("Le user envoyé============> ",userData)
  
      return this.httpClient
        .delete<any>(environment.apiUrl + "eservices/delete/"+id, { headers })
        .pipe(
          map((response) => new Eservice({
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
