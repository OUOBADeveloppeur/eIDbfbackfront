import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Resumes } from './resumes.model';

@Injectable({
  providedIn: 'root',
})
export class ResumesService {
  private readonly API_URL = 'assets/data/resumes.json';

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all resumes */
  getAllResumes(): Observable<Resumes[]> {
    return this.httpClient
      .get<Resumes[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new resume */
  addResume(resume: Resumes): Observable<Resumes> {
    return this.httpClient.post<Resumes>(this.API_URL, resume).pipe(
      map(() => {
        return resume; // return the newly added resume
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing resume */
  updateResume(resume: Resumes): Observable<Resumes> {
    return this.httpClient.put<Resumes>(`${this.API_URL}`, resume).pipe(
      map(() => {
        return resume; // return the updated resume
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a resume by ID */
  deleteResume(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // return the ID of the deleted resume
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
