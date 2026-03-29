import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ClientPayment } from './client-payment.model';

@Injectable({
  providedIn: 'root',
})
export class ClientPaymentService {
  private readonly API_URL = 'assets/data/clientPayment.json';

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all payments */
  getAllPayments(): Observable<ClientPayment[]> {
    return this.httpClient
      .get<ClientPayment[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new client payment */
  addPayment(clientPayment: ClientPayment): Observable<ClientPayment> {
    return this.httpClient
      .post<ClientPayment>(this.API_URL, clientPayment)
      .pipe(
        map(() => {
          return clientPayment; // Return the newly added client payment
        }),
        catchError(this.handleError)
      );
  }

  /** PUT: Update an existing client payment */
  updatePayment(clientPayment: ClientPayment): Observable<ClientPayment> {
    return this.httpClient
      .put<ClientPayment>(`${this.API_URL}`, clientPayment) // Use the API_URL directly for updates
      .pipe(
        map(() => {
          return clientPayment; // Return the updated client payment
        }),
        catchError(this.handleError)
      );
  }

  /** DELETE: Remove a client payment by ID */
  deletePayment(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // Return the ID of the deleted client payment
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
