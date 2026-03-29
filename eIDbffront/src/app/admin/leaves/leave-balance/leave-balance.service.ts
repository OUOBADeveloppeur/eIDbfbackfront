import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { LeaveBalance } from './leave-balance.model';

@Injectable({
  providedIn: 'root',
})
export class LeaveBalanceService {
  private readonly API_URL = 'assets/data/leave-balance.json';
  private dataChange: BehaviorSubject<LeaveBalance[]> = new BehaviorSubject<
    LeaveBalance[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  get data(): LeaveBalance[] {
    return this.dataChange.value;
  }

  /** GET: Fetch all leave balances */
  getAllLeaveBalances(): Observable<LeaveBalance[]> {
    return this.httpClient
      .get<LeaveBalance[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new leave balance */
  addLeaveBalance(leaveBalance: LeaveBalance): Observable<LeaveBalance> {
    return this.httpClient.post<LeaveBalance>(this.API_URL, leaveBalance).pipe(
      map(() => {
        return leaveBalance; // return the newly added leave balance
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing leave balance */
  updateLeaveBalance(leaveBalance: LeaveBalance): Observable<LeaveBalance> {
    return this.httpClient
      .put<LeaveBalance>(`${this.API_URL}`, leaveBalance)
      .pipe(
        map(() => {
          return leaveBalance; // return the updated leave balance
        }),
        catchError(this.handleError)
      );
  }

  /** DELETE: Remove a leave balance by ID */
  deleteLeaveBalance(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // return the ID of the deleted leave balance
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
