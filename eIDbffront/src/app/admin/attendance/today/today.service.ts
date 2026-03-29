import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Today } from './today.model';

@Injectable({
  providedIn: 'root',
})
export class TodayService {
  private readonly API_URL = 'assets/data/today.json';
  private dataChange: BehaviorSubject<Today[]> = new BehaviorSubject<Today[]>(
    []
  );

  constructor(private httpClient: HttpClient) {}

  get data(): Today[] {
    return this.dataChange.value;
  }

  /** GET: Fetch all today's data */
  getAllTodays(): Observable<Today[]> {
    return this.httpClient.get<Today[]>(this.API_URL).pipe(
      map((todays) => {
        this.dataChange.next(todays); // Update the data change observable
        return todays;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new today's data */
  addToday(today: Today): Observable<Today> {
    return this.httpClient.post<Today>(this.API_URL, today).pipe(
      map(() => {
        return today; // Return the newly added today's data
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing today's data */
  updateToday(today: Today): Observable<Today> {
    return this.httpClient.put<Today>(`${this.API_URL}`, today).pipe(
      map(() => {
        return today; // Return the updated today's data
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove today's data by ID */
  deleteToday(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // Return the ID of the deleted today's data
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
