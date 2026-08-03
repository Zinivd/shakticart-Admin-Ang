import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


import { BaseUrlsService } from './base-urls.service';
import { EndpointsService } from './endpoints.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  private readonly http: HttpClient = inject(HttpClient);


  constructor(
    private urlHelper: BaseUrlsService,
    private envUrl: EndpointsService,
    private router: Router // ✅ instance injected
  ) { }

  // Build headers (with token if available)
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    });
  }



  private getHeadersforFormdata(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      ...(token && { Authorization: `Bearer ${token}` }),
    });
  }


  // public GetuserInfo<T>(): Observable<T> {
  //   const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.GetuserInfo
  //     }`;

  //   return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
  //     catchError((error) => {
  //       // 🔥 1. Handle 403 Unauthorized -> logout & redirect
  //       if (error.status === 403) {
  //         sessionStorage.clear();
  //         localStorage.clear();
  //         this.router.navigate(['/auth/sign-in']);
  //       }
  //       if (
  //         error.error.success === false &&
  //         error.error.message == 'Session expired'
  //       ) {
  //         this.router.navigate(['/auth/sign-in']);
  //       }

  //       //console.error('Get Associations API error', error.error.success);
  //       return throwError(() => ({
  //         statusCode: 500,
  //         message: 'Get Associations API error',
  //         error,
  //       }));
  //     })
  //   );
  // }




  // public BulkSignup<T>(formdata: FormData): Observable<T> {
  //   // ✅ Use the instance envUrl, not the class
  //   const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.BulkSignup}`;

  //   return this.http
  //     .post<T>(serviceURL, formdata, { headers: this.getHeadersforFormdata() })
  //     .pipe(
  //       catchError((error) => {
  //         // 🔥 1. Handle 403 Unauthorized -> logout & redirect
  //         if (error.status === 403) {
  //           sessionStorage.clear();
  //           localStorage.clear();
  //           this.router.navigate(['/auth/sign-in']);
  //         }
  //         if (
  //           error.error.success === false &&
  //           error.error.message == 'Session expired'
  //         ) {
  //           this.router.navigate(['/auth/sign-in']);
  //         }
  //         //console.error('Login API error', error);
  //         return throwError(() => ({
  //           statusCode: 500,
  //           message: 'Login API error',
  //           error,
  //         }));
  //       })
  //     );
  // }


  // public createClass<T>(payload: any): Observable<T> {
  //   // ✅ Use the instance envUrl, not the class
  //   const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.createClass}`;

  //   return this.http
  //     .post<T>(serviceURL, payload, { headers: this.getHeaders() })
  //     .pipe(
  //       catchError((error) => {
  //         // 🔥 1. Handle 403 Unauthorized -> logout & redirect
  //         if (error.status === 403) {
  //           sessionStorage.clear();
  //           localStorage.clear();
  //           this.router.navigate(['/auth/sign-in']);
  //         }
  //         if (
  //           error.error.success === false &&
  //           error.error.message == 'Session expired'
  //         ) {
  //           this.router.navigate(['/auth/sign-in']);
  //         }
  //         //console.error('Login API error', error);
  //         return throwError(() => ({
  //           statusCode: 500,
  //           message: 'Login API error',
  //           error,
  //         }));
  //       })
  //     );
  // }
}
