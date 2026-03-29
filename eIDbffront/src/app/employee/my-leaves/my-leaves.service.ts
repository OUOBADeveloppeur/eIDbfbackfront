import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { MyLeaves } from './my-leaves.model';

@Injectable({
  providedIn: 'root',
})
export class MyLeavesService {
  private readonly API_URL = 'assets/data/empLeaveReq.json';

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all my leaves */
  getAllMyLeaves(): Observable<MyLeaves[]> {
    return this.httpClient
      .get<MyLeaves[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new leave request */
  addMyLeaves(myLeaves: MyLeaves): Observable<MyLeaves> {
    return this.httpClient.post<MyLeaves>(this.API_URL, myLeaves).pipe(
      map(() => {
        return myLeaves; // return the newly added leave request
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing leave request */
  updateMyLeaves(myLeaves: MyLeaves): Observable<MyLeaves> {
    return this.httpClient.put<MyLeaves>(`${this.API_URL}`, myLeaves).pipe(
      map(() => {
        return myLeaves; // return the updated leave request
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a leave request by ID */
  deleteMyLeaves(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}/${id}`).pipe(
      map(() => {
        return id; // return the ID of the deleted leave request
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
