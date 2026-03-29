import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Leaves } from './leaves.model';

@Injectable({
  providedIn: 'root',
})
export class LeavesService {
  private readonly API_URL = 'assets/data/leaves.json';

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all leaves */
  getAllLeaves(): Observable<Leaves[]> {
    return this.httpClient
      .get<Leaves[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new leave */
  addLeaves(leaves: Leaves): Observable<Leaves> {
    return this.httpClient.post<Leaves>(this.API_URL, leaves).pipe(
      map(() => {
        return leaves; // return the newly added leave
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing leave */
  updateLeaves(leaves: Leaves): Observable<Leaves> {
    return this.httpClient.put<Leaves>(`${this.API_URL}`, leaves).pipe(
      map(() => {
        return leaves; // return the updated leave
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a leave by ID */
  deleteLeaves(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // return the ID of the deleted leave
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
