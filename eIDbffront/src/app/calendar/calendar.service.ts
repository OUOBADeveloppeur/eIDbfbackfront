import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Calendar } from './calendar.model';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { EventInput } from '@fullcalendar/core';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly API_URL = 'assets/data/calendar.json';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  dataChange: BehaviorSubject<Calendar[]> = new BehaviorSubject<Calendar[]>([]);
  dialogData!: Calendar;

  constructor(private httpClient: HttpClient) {}

  get data(): Calendar[] {
    return this.dataChange.value;
  }

  getDialogData(): Calendar {
    return this.dialogData;
  }

  /** CRUD Methods */

  /** GET: Fetch all calendars */
  // getAllCalendars(): Observable<Calendar[]> {
  //   return this.httpClient
  //     .get<Calendar[]>(this.API_URL)
  //     .pipe(catchError(this.errorHandler));
  // }

  async loadEvents(): Promise<EventInput[]> {
    const response = await fetch(this.API_URL);
    const events = await response.json();

    return events.map((event: any) => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start), // Make sure to parse the date string
      end: new Date(event.end), // Make sure to parse the date string
      className: event.className,
      groupId: event.groupId,
      details: event.details,
      allDay: event.allDay || false, // Default to false if not provided
    }));
  }

  /** POST: Add a new calendar */
  addCalendar(calendar: Calendar): Observable<Calendar> {
    return this.httpClient.post<Calendar>(this.API_URL, Calendar).pipe(
      map((response) => {
        return calendar; // return response from API
      }),
      catchError(this.errorHandler)
    );
  }

  /** PUT: Update an existing calendar */
  updateCalendar(calendar: Calendar): Observable<Calendar> {
    return this.httpClient.put<Calendar>(`${this.API_URL}`, calendar).pipe(
      map((response) => {
        return calendar; // return response from API
      }),
      catchError(this.errorHandler)
    );
  }

  /** DELETE: Remove a calendar by ID */
  deleteCalendar(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map((response) => {
        return id; // return the ID of the deleted doctor
      }),
      catchError(this.errorHandler)
    );
  }

  /** Error Handler */
  private errorHandler(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
