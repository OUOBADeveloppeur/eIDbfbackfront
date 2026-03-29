import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Department } from './department.model';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly API_URL = 'assets/data/department.json';
  dataChange: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>(
    []
  );
  token: string;

  constructor(private httpClient: HttpClient) {
            this.token='Basic ' + window.btoa(environment.username + ":" + environment.password);
    
  }

  /** GET: Fetch all departments */
  getAllDepartments2(): Observable<Department[]> {
    return this.httpClient
      .get<Department[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

    getAllDepartments(): Observable<Department[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

    return this.httpClient.get<Department[]>(environment.apiUrl+"departements", { headers });
  }

  /** POST: Add a new department */


    addDepartment(client: any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.token
      });
  
      // Transformer le client en bénéficiaire pour l'API
      const departement = {
        nom: client.department_name
       
      };
      console.log("sent=======> ",departement)
  
      return this.httpClient
        .post<any>(environment.apiUrl + "addDepartement", departement, { headers })
        .pipe(
          map((response) => {
            id: response.id 
          
           
          
      
         
            
          }),
          catchError(this.handleError)
        );
    }

 updateDepartment(client: any): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.token
      });
  
      // Transformer le client en bénéficiaire pour l'API
      const departement = {
        nom: client.department_name,
        id:client.id
       
      };
      console.log("sent=======> ",departement)
  
      return this.httpClient
        .post<any>(environment.apiUrl + "update/departement", departement, { headers })
        .pipe(
          map((response) => {
            id: response.id 
          
           
          
      
         
            
          }),
          catchError(this.handleError)
        );
    }




  addDepartment2(department: Department): Observable<Department> {
    return this.httpClient.post<Department>(this.API_URL, department).pipe(
      map((response) => {
        return department; // return department from API
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing department */
  updateDepartment2(department: Department): Observable<Department> {
    return this.httpClient.put<Department>(`${this.API_URL}`, department).pipe(
      map((response) => {
        return department; // return department from API
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a department by ID */
  deleteDepartment2(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // return the ID of the deleted department
      }),
      catchError(this.handleError)
    );
  }


  
 deleteDepartment(id: number): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.token
      });
  
      // Transformer le client en bénéficiaire pour l'API
      const departement = {
      
        id:id
       
      };
      console.log("sent=======> ",departement)
  
      return this.httpClient
        .post<any>(environment.apiUrl + "delete/departement", departement, { headers })
        .pipe(
          map((response) => {
            id: response.id 
          
           
          
      
         
            
          }),
          catchError(this.handleError)
        );
    }


  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
