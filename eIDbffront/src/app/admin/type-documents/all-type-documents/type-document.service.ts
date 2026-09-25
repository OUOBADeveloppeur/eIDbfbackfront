import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { TypeDocument } from './type-document.model';
import { environment } from 'environments/environment';
import { AuthService } from '@core/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TypeDocumentService {
  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  getAllTypeDocuments(): Observable<TypeDocument[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    return this.httpClient.get<TypeDocument[]>(environment.apiUrl + "typedocuments/all", { headers });
  }

  addTypeDocument(typeDocument: TypeDocument): Observable<TypeDocument> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    const data = {
      libelle: typeDocument.libelle,
      description: typeDocument.description,
    };

    return this.httpClient
      .post<any>(environment.apiUrl + "typedocuments/creer", JSON.stringify(data), { headers })
      .pipe(
        map((response) => new TypeDocument({
          id: response.id || typeDocument.id,
          libelle: response.libelle,
          description: response.description,
        })),
        catchError(this.handleError)
      );
  }

  updateTypeDocument(typeDocument: TypeDocument): Observable<TypeDocument> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    const data = {
      libelle: typeDocument.libelle,
      description: typeDocument.description,
    };

    return this.httpClient
      .put<any>(environment.apiUrl + "typedocuments/update/" + typeDocument.id, JSON.stringify(data), { headers })
      .pipe(
        map((response) => new TypeDocument({
          id: response.id || typeDocument.id,
          libelle: response.libelle,
          description: response.description,
        })),
        catchError(this.handleError)
      );
  }

  deleteTypeDocument(id: number): Observable<TypeDocument> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + this.authService.currentUserValue.token
    });

    return this.httpClient
      .delete<any>(environment.apiUrl + "typedocuments/delete/" + id, { headers })
      .pipe(
        map((response) => new TypeDocument({
          id: response?.id || id
        })),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}

