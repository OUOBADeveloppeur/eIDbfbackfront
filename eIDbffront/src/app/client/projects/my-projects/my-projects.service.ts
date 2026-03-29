import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { MyProjects } from './my-projects.model';

@Injectable({
  providedIn: 'root',
})
export class MyProjectsService {
  private readonly API_URL = 'assets/data/my-projects-client.json';

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all projects */
  getAllMyProjects(): Observable<MyProjects[]> {
    return this.httpClient
      .get<MyProjects[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new project */
  addMyProjects(myProjects: MyProjects): Observable<MyProjects> {
    return this.httpClient.post<MyProjects>(this.API_URL, myProjects).pipe(
      map(() => myProjects), // Return the added project
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing project */
  updateMyProjects(myProjects: MyProjects): Observable<MyProjects> {
    return this.httpClient.put<MyProjects>(`${this.API_URL}`, myProjects).pipe(
      map(() => myProjects), // Return the updated project
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a project by ID */
  deleteMyProjects(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => id), // Return the ID of the deleted project
      catchError(this.handleError)
    );
  }

  /** Handle HTTP errors */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
