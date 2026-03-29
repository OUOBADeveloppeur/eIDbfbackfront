import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Attendances } from './attendance.model';

@Injectable({
  providedIn: 'root',
})
export class AttendancesService {
  private readonly API_URL = 'assets/data/attendance.json';

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all attendances */
  getAllAttendances(): Observable<Attendances[]> {
    return this.httpClient
      .get<Attendances[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new attendance */
  addAttendance(attendance: Attendances): Observable<Attendances> {
    return this.httpClient.post<Attendances>(this.API_URL, attendance).pipe(
      map(() => {
        return attendance; // return the newly added attendance
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing attendance */
  updateAttendance(attendance: Attendances): Observable<Attendances> {
    return this.httpClient.put<Attendances>(`${this.API_URL}`, attendance).pipe(
      map(() => {
        return attendance; // return the updated attendance
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove an attendance by ID */
  deleteAttendance(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // return the ID of the deleted attendance
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
