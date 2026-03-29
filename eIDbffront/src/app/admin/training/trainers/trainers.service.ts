import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Trainers } from './trainers.model';

@Injectable({
  providedIn: 'root',
})
export class TrainersService {
  private readonly API_URL = 'assets/data/trainers.json';

  dataChange: BehaviorSubject<Trainers[]> = new BehaviorSubject<Trainers[]>([]);

  dialogData!: Trainers;

  constructor(private httpClient: HttpClient) {}

  get data(): Trainers[] {
    return this.dataChange.value;
  }

  getDialogData(): Trainers {
    return this.dialogData;
  }

  /** CRUD METHODS */

  /** GET: Fetch trainers */
  getTrainers(): Observable<Trainers[]> {
    return this.httpClient.get<Trainers[]>(this.API_URL).pipe(
      map((data) => {
        this.dataChange.next(data);
        return data;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new trainer */
  addTrainer(trainer: Trainers): Observable<Trainers> {
    return this.httpClient.post<Trainers>(this.API_URL, trainer).pipe(
      map(() => {
        this.dialogData = trainer;
        return trainer;
      }),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing trainer */
  updateTrainer(trainer: Trainers): Observable<Trainers> {
    return this.httpClient.put<Trainers>(`${this.API_URL}`, trainer).pipe(
      map(() => {
        this.dialogData = trainer;
        return trainer;
      }),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove a trainer by ID */
  deleteTrainer(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id;
      }),
      catchError(this.handleError)
    );
  }

  /** GET: Search trainers by name */
  searchTrainersByName(name: string): Observable<Trainers[]> {
    return this.httpClient.get<Trainers[]>(`${this.API_URL}?name=${name}`).pipe(
      map((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  /** GET: Filter trainers by specialization */
  getTrainersBySpecialization(specialization: string): Observable<Trainers[]> {
    return this.httpClient
      .get<Trainers[]>(`${this.API_URL}?specialization=${specialization}`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  /** GET: Get available trainers */
  getAvailableTrainers(startDate: Date, endDate: Date): Observable<Trainers[]> {
    return this.httpClient
      .get<Trainers[]>(
        `${
          this.API_URL
        }?availability_startDate_lte=${startDate.toISOString()}&availability_endDate_gte=${endDate.toISOString()}`
      )
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  /** GET: Get trainer details by ID */
  getTrainerById(id: number): Observable<Trainers> {
    return this.httpClient.get<Trainers>(`${this.API_URL}/${id}`).pipe(
      map((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Assign trainer to a training */
  assignTrainerToTraining(
    trainerId: number,
    trainingId: number
  ): Observable<any> {
    return this.httpClient
      .post<any>(`${this.API_URL}/assign`, {
        trainerId,
        trainingId,
      })
      .pipe(
        map((data) => {
          return data;
        }),
        catchError(this.handleError)
      );
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
