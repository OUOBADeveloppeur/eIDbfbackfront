import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Candidates } from './candidates.model';

@Injectable({
  providedIn: 'root',
})
export class CandidatesService {
  private readonly API_URL = 'assets/data/candidates.json';

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all candidates */
  getAllCandidates(): Observable<Candidates[]> {
    return this.httpClient
      .get<Candidates[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new candidate */
  addCandidate(candidate: Candidates): Observable<Candidates> {
    return this.httpClient.post<Candidates>(this.API_URL, candidate).pipe(
      map(() => {
        return candidate; // return the newly added candidate
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing candidate */
  updateCandidate(candidate: Candidates): Observable<Candidates> {
    return this.httpClient.put<Candidates>(`${this.API_URL}`, candidate).pipe(
      map(() => {
        return candidate; // return the updated candidate
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a candidate by ID */
  deleteCandidate(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // return the ID of the deleted candidate
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
