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
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    });
  }



  private getHeadersforFormdata(): HttpHeaders {
    const token = localStorage.getItem('token');
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


  public loginApi<T>(payload: any): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.loginApi}`;

    return this.http
      .post<T>(serviceURL, payload, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          // 🔥 1. Handle 403 Unauthorized -> logout & redirect
          if (error.status === 403) {
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['/auth/sign-in']);
          }
          if (
            error.error.success === false &&
            error.error.message == 'Session expired'
          ) {
            this.router.navigate(['/auth/sign-in']);
          }
          //console.error('Login API error', error);
          return throwError(() => ({
            statusCode: 500,
            message: 'Login API error',
            error,
          }));
        })
      );
  }


  public getAllCategories<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.getAllCategories
      }`;

    return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        // 🔥 1. Handle 403 Unauthorized -> logout & redirect
        if (error.status === 403) {
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['/auth/sign-in']);
        }
        if (
          error.error.success === false &&
          error.error.message == 'Session expired'
        ) {
          this.router.navigate(['/auth/sign-in']);
        }

        //console.error('Get Associations API error', error.error.success);
        return throwError(() => ({
          statusCode: 500,
          message: 'Get Associations API error',
          error,
        }));
      })
    );
  }


  public getAllSubCategories<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.getAllSubCategories
      }`;

    return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        // 🔥 1. Handle 403 Unauthorized -> logout & redirect
        if (error.status === 403) {
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['/auth/sign-in']);
        }
        if (
          error.error.success === false &&
          error.error.message == 'Session expired'
        ) {
          this.router.navigate(['/auth/sign-in']);
        }

        //console.error('Get Associations API error', error.error.success);
        return throwError(() => ({
          statusCode: 500,
          message: 'Get Associations API error',
          error,
        }));
      })
    );
  }


  public getAllColors<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.getAllColors
      }`;

    return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        // 🔥 1. Handle 403 Unauthorized -> logout & redirect
        if (error.status === 403) {
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['/auth/sign-in']);
        }
        if (
          error.error.success === false &&
          error.error.message == 'Session expired'
        ) {
          this.router.navigate(['/auth/sign-in']);
        }

        //console.error('Get Associations API error', error.error.success);
        return throwError(() => ({
          statusCode: 500,
          message: 'Get Associations API error',
          error,
        }));
      })
    );
  }

  
  public addColor<T>(payload: any): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.addColor}`;

    return this.http
      .post<T>(serviceURL, payload, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          // 🔥 1. Handle 403 Unauthorized -> logout & redirect
          if (error.status === 403) {
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['/auth/sign-in']);
          }
          if (
            error.error.success === false &&
            error.error.message == 'Session expired'
          ) {
            this.router.navigate(['/auth/sign-in']);
          }
          //console.error('Login API error', error);
          return throwError(() => ({
            statusCode: 500,
            message: 'Login API error',
            error,
          }));
        })
      );
  }
  

  
  public deleteColor<T>(payload: any): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.deleteColor}/${payload}`;

    return this.http
      .delete<T>(serviceURL, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          // 🔥 1. Handle 403 Unauthorized -> logout & redirect
          if (error.status === 403) {
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['/auth/sign-in']);
          }
          if (
            error.error.success === false &&
            error.error.message == 'Session expired'
          ) {
            this.router.navigate(['/auth/sign-in']);
          }
          //console.error('Login API error', error);
          return throwError(() => ({
            statusCode: 500,
            message: 'Login API error',
            error,
          }));
        })
      );
  }

  


  public addsubcategory<T>(payload: any): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.addsubcategory}`;

    return this.http
      .post<T>(serviceURL, payload, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          // 🔥 1. Handle 403 Unauthorized -> logout & redirect
          if (error.status === 403) {
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['/auth/sign-in']);
          }
          if (
            error.error.success === false &&
            error.error.message == 'Session expired'
          ) {
            this.router.navigate(['/auth/sign-in']);
          }
          //console.error('Login API error', error);
          return throwError(() => ({
            statusCode: 500,
            message: 'Login API error',
            error,
          }));
        })
      );
  }


  

  public getAllOrders<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.getAllOrders
      }`;

    return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        // 🔥 1. Handle 403 Unauthorized -> logout & redirect
        if (error.status === 403) {
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['/auth/sign-in']);
        }
        if (
          error.error.success === false &&
          error.error.message == 'Session expired'
        ) {
          this.router.navigate(['/auth/sign-in']);
        }

        //console.error('Get Associations API error', error.error.success);
        return throwError(() => ({
          statusCode: 500,
          message: 'Get Associations API error',
          error,
        }));
      })
    );
  }
  

  public getAllCustomers<T>(payload: any): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.getAllCustomers
      }?email=${payload}`;

    return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        // 🔥 1. Handle 403 Unauthorized -> logout & redirect
        if (error.status === 403) {
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['/auth/sign-in']);
        }
        if (
          error.error.success === false &&
          error.error.message == 'Session expired'
        ) {
          this.router.navigate(['/auth/sign-in']);
        }

        //console.error('Get Associations API error', error.error.success);
        return throwError(() => ({
          statusCode: 500,
          message: 'Get Associations API error',
          error,
        }));
      })
    );
  }
  

  public getUserInfo<T>(payload: any): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.getUserInfo
      }?email=${payload}`;

    return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        // 🔥 1. Handle 403 Unauthorized -> logout & redirect
        if (error.status === 403) {
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['/auth/sign-in']);
        }
        if (
          error.error.success === false &&
          error.error.message == 'Session expired'
        ) {
          this.router.navigate(['/auth/sign-in']);
        }

        //console.error('Get Associations API error', error.error.success);
        return throwError(() => ({
          statusCode: 500,
          message: 'Get Associations API error',
          error,
        }));
      })
    );
  }


  public imageUpload<T>(formdata: FormData): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.imageUpload}`;

    return this.http
      .post<T>(serviceURL, formdata, { headers: this.getHeadersforFormdata() })
      .pipe(
        catchError((error) => {
          // 🔥 1. Handle 403 Unauthorized -> logout & redirect
          if (error.status === 403) {
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['/auth/sign-in']);
          }
          if (
            error.error.success === false &&
            error.error.message == 'Session expired'
          ) {
            this.router.navigate(['/auth/sign-in']);
          }
          //console.error('Login API error', error);
          return throwError(() => ({
            statusCode: 500,
            message: 'Login API error',
            error,
          }));
        })
      );
  }


  public addcategory<T>(formdata: FormData): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.addcategory}`;

    return this.http
      .post<T>(serviceURL, formdata, { headers: this.getHeadersforFormdata() })
      .pipe(
        catchError((error) => {
          // 🔥 1. Handle 403 Unauthorized -> logout & redirect
          if (error.status === 403) {
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['/auth/sign-in']);
          }
          if (
            error.error.success === false &&
            error.error.message == 'Session expired'
          ) {
            this.router.navigate(['/auth/sign-in']);
          }
          //console.error('Login API error', error);
          return throwError(() => ({
            statusCode: 500,
            message: 'Login API error',
            error,
          }));
        })
      );
  }


  

  public getimagegetAll<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.imagegetAll
      }`;

    return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        // 🔥 1. Handle 403 Unauthorized -> logout & redirect
        if (error.status === 403) {
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['/auth/sign-in']);
        }
        if (
          error.error.success === false &&
          error.error.message == 'Session expired'
        ) {
          this.router.navigate(['/auth/sign-in']);
        }

        //console.error('Get Associations API error', error.error.success);
        return throwError(() => ({
          statusCode: 500,
          message: 'Get Associations API error',
          error,
        }));
      })
    );
  }


  
  public imageDelete<T>(payload: any): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.imageDelete}/${payload}`;

    return this.http
      .delete<T>(serviceURL, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          // 🔥 1. Handle 403 Unauthorized -> logout & redirect
          if (error.status === 403) {
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['/auth/sign-in']);
          }
          if (
            error.error.success === false &&
            error.error.message == 'Session expired'
          ) {
            this.router.navigate(['/auth/sign-in']);
          }
          //console.error('Login API error', error);
          return throwError(() => ({
            statusCode: 500,
            message: 'Login API error',
            error,
          }));
        })
      );
  }


  

  public getAllProducts<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.getAllProducts
      }`;

    return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        // 🔥 1. Handle 403 Unauthorized -> logout & redirect
        if (error.status === 403) {
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['/auth/sign-in']);
        }
        if (
          error.error.success === false &&
          error.error.message == 'Session expired'
        ) {
          this.router.navigate(['/auth/sign-in']);
        }

        //console.error('Get Associations API error', error.error.success);
        return throwError(() => ({
          statusCode: 500,
          message: 'Get Associations API error',
          error,
        }));
      })
    );
  }




  public AddProduct<T>(payload: any): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.AddProduct}`;

    return this.http
      .post<T>(serviceURL, payload, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          // 🔥 1. Handle 403 Unauthorized -> logout & redirect
          if (error.status === 403) {
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['/auth/sign-in']);
          }
          if (
            error.error.success === false &&
            error.error.message == 'Session expired'
          ) {
            this.router.navigate(['/auth/sign-in']);
          }
          //console.error('Login API error', error);
          return throwError(() => ({
            statusCode: 500,
            message: 'Login API error',
            error,
          }));
        })
      );
  }



  public createbanners<T>(payload: any): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.createbanners}`;

    return this.http
      .post<T>(serviceURL, payload, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          // 🔥 1. Handle 403 Unauthorized -> logout & redirect
          if (error.status === 403) {
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['/auth/sign-in']);
          }
          if (
            error.error.success === false &&
            error.error.message == 'Session expired'
          ) {
            this.router.navigate(['/auth/sign-in']);
          }
          //console.error('Login API error', error);
          return throwError(() => ({
            statusCode: 500,
            message: 'Login API error',
            error,
          }));
        })
      );
  }



  public publishBanners<T>(payload: any): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.publishBanners}/${payload}/publish`;

   return this.http.patch<T>(serviceURL, {}, { headers: this.getHeaders() }).pipe(
        catchError((error) => {
          // 🔥 1. Handle 403 Unauthorized -> logout & redirect
          if (error.status === 403) {
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['/auth/sign-in']);
          }
          if (
            error.error.success === false &&
            error.error.message == 'Session expired'
          ) {
            this.router.navigate(['/auth/sign-in']);
          }
          //console.error('Login API error', error);
          return throwError(() => ({
            statusCode: 500,
            message: 'Login API error',
            error,
          }));
        })
      );
  }


  

  public getAllBanners<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.getAllBanners
      }`;

    return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        // 🔥 1. Handle 403 Unauthorized -> logout & redirect
        if (error.status === 403) {
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['/auth/sign-in']);
        }
        if (
          error.error.success === false &&
          error.error.message == 'Session expired'
        ) {
          this.router.navigate(['/auth/sign-in']);
        }

        //console.error('Get Associations API error', error.error.success);
        return throwError(() => ({
          statusCode: 500,
          message: 'Get Associations API error',
          error,
        }));
      })
    );
  }

}
