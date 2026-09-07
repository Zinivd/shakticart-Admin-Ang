import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BaseUrlsService } from './base-urls.service';
import { EndpointsService } from './endpoints.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiServicesService {
  private readonly http: HttpClient = inject(HttpClient);

  constructor(
    private urlHelper: BaseUrlsService,
    private envUrl: EndpointsService,
    private router: Router, // ✅ instance injected
  ) {}

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
        }),
      );
  }

  public getAllCategories<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${
      this.envUrl.getAllCategories
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
      }),
    );
  }

  public getAllSubCategories<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${
      this.envUrl.getAllSubCategories
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
      }),
    );
  }

  public getAllColors<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${
      this.envUrl.getAllColors
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
      }),
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
        }),
      );
  }

  public deleteColor<T>(payload: any): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.deleteColor}/${payload}`;

    return this.http.delete<T>(serviceURL, { headers: this.getHeaders() }).pipe(
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
      }),
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
        }),
      );
  }

  public UpdateSubCategory<T>(payload: any): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.UpdateSubCategory}`;

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
        }),
      );
  }

  public getAllOrders<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${
      this.envUrl.getAllOrders
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
      }),
    );
  }

  public getAllCustomers<T>(payload: any): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${
      this.envUrl.getAllCustomers
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
      }),
    );
  }

  public getUserInfo<T>(payload: any): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${
      this.envUrl.getUserInfo
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
      }),
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
        }),
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
        }),
      );
  }

  public UpdateCategory<T>(formdata: FormData): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.UpdateCategory}`;

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
        }),
      );
  }

  public getimagegetAll<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${
      this.envUrl.imagegetAll
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
      }),
    );
  }

  public imageDelete<T>(payload: any): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.imageDelete}/${payload}`;

    return this.http.delete<T>(serviceURL, { headers: this.getHeaders() }).pipe(
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
      }),
    );
  }

  public getAllProducts<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${
      this.envUrl.getAllProducts
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
      }),
    );
  }

  public getAllProductsbyid<T>(id: any): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${
      this.envUrl.getAllProducts
    }/${id}`;

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
      }),
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
        }),
      );
  }

  public updateProduct<T>(prd_id: any, payload: any): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.AddProduct}/${prd_id}`;

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
        }),
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
        }),
      );
  }

  public publishBanners<T>(payload: any): Observable<T> {
    // ✅ Use the instance envUrl, not the class
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.publishBanners}/${payload}/publish`;

    return this.http
      .patch<T>(serviceURL, {}, { headers: this.getHeaders() })
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
        }),
      );
  }

  public getAllBanners<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${
      this.envUrl.getAllBanners
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
      }),
    );
  }

  public updateStock<T>(
    productId: any,
    colorId: any,
    inventoryId: any,
    payload: { stock: number },
  ): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.stockBase}/${productId}/colors/${colorId}/inventory/${inventoryId}/stock`;
    return this.http
      .patch<T>(serviceURL, payload, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
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
          return throwError(() => ({
            statusCode: 500,
            message: 'Login API error',
            error,
          }));
        }),
      );
  }

  public getAllProductspage<T>(page?: number): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.getAllProducts}${page ? '?page=' + page : ''}`;
    return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
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
        return throwError(() => ({
          statusCode: 500,
          message: 'Get Associations API error',
          error,
        }));
      }),
    );
  }

  public getAdminReviews<T>(productId?: string, status?: string): Observable<T> {
  const params: string[] = [];
  if (status) params.push(`status=${status}`);
  const query = params.length ? `?${params.join('&')}` : '';

  const base = productId
    ? `${this.envUrl.getAdminReviews}/${productId}`
    : `${this.envUrl.getAdminReviews}`;

  const serviceURL = `${this.urlHelper.getAPIURL()}${base}${query}`;

  return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
    catchError((error) => {
      if (error.status === 403) {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/auth/sign-in']);
      }
      if (error.error.success === false && error.error.message == 'Session expired') {
        this.router.navigate(['/auth/sign-in']);
      }
      return throwError(() => ({
        statusCode: 500,
        message: 'Get Admin Reviews API error',
        error,
      }));
    }),
  );
}

  public addAdminReview<T>(payload: any): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.addAdminReview}`;
    return this.http
      .post<T>(serviceURL, payload, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
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
          return throwError(() => ({
            statusCode: 500,
            message: 'Add Admin Review API error',
            error,
          }));
        }),
      );
  }

  public approveReview<T>(id: number, isApproved: boolean): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.approveReview}/${id}/approve`;
    return this.http
      .put<T>(
        serviceURL,
        { is_approved: isApproved },
        { headers: this.getHeaders() },
      )
      .pipe(
        catchError((error) => {
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
          return throwError(() => ({
            statusCode: 500,
            message: 'Approve Review API error',
            error,
          }));
        }),
      );
  }

  public getQuickHitsAdmin<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.getQuickHitsAdmin}`;
    return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
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
        return throwError(() => ({
          statusCode: 500,
          message: 'Get Quick Hits API error',
          error,
        }));
      }),
    );
  }

  public addQuickHit<T>(payload: {
    product_id: number;
    position?: number;
  }): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.addQuickHit}`;
    return this.http
      .post<T>(serviceURL, payload, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
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
          return throwError(() => ({
            statusCode: 500,
            message: 'Add Quick Hit API error',
            error,
          }));
        }),
      );
  }

  public removeQuickHit<T>(productId: number): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.removeQuickHit}`;
    return this.http
      .post<T>(
        serviceURL,
        { product_id: productId },
        { headers: this.getHeaders() },
      )
      .pipe(
        catchError((error) => {
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
          return throwError(() => ({
            statusCode: 500,
            message: 'Remove Quick Hit API error',
            error,
          }));
        }),
      );
  }

  public toggleQuickHit<T>(
    productId: number,
    isActive: boolean,
  ): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.toggleQuickHit}`;
    return this.http
      .post<T>(
        serviceURL,
        { product_id: productId, is_active: isActive },
        { headers: this.getHeaders() },
      )
      .pipe(
        catchError((error) => {
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
          return throwError(() => ({
            statusCode: 500,
            message: 'Toggle Quick Hit API error',
            error,
          }));
        }),
      );
  }

  public reorderQuickHits<T>(
    order: { product_id: number; position: number }[],
  ): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.reorderQuickHits}`;
    return this.http
      .post<T>(serviceURL, { order }, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
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
          return throwError(() => ({
            statusCode: 500,
            message: 'Reorder Quick Hits API error',
            error,
          }));
        }),
      );
  }

  // reuse existing getAllProducts() for the product picker in the Add modal

  // ---------------- Reels (admin) ✅ NEW ----------------

  public getAllReels<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.getAllReels}`;
    return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
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
        return throwError(() => ({
          statusCode: 500,
          message: 'Get All Reels API error',
          error,
        }));
      }),
    );
  }

  public createReel<T>(formdata: FormData): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.createReel}`;
    return this.http
      .post<T>(serviceURL, formdata, { headers: this.getHeadersforFormdata() })
      .pipe(
        catchError((error) => {
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
          return throwError(() => ({
            statusCode: 500,
            message: 'Create Reel API error',
            error,
          }));
        }),
      );
  }

  public updateReel<T>(formdata: FormData): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.updateReel}`;
    return this.http
      .post<T>(serviceURL, formdata, { headers: this.getHeadersforFormdata() })
      .pipe(
        catchError((error) => {
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
          return throwError(() => ({
            statusCode: 500,
            message: 'Update Reel API error',
            error,
          }));
        }),
      );
  }

  public updateReelStatus<T>(id: number, isPublished: boolean): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.updateReelStatus}`;
    return this.http
      .post<T>(
        serviceURL,
        { id, is_published: isPublished },
        { headers: this.getHeaders() },
      )
      .pipe(
        catchError((error) => {
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
          return throwError(() => ({
            statusCode: 500,
            message: 'Update Reel Status API error',
            error,
          }));
        }),
      );
  }

  public deleteReel<T>(id: number): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.deleteReel}`;
    return this.http
      .post<T>(serviceURL, { id }, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
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
          return throwError(() => ({
            statusCode: 500,
            message: 'Delete Reel API error',
            error,
          }));
        }),
      );
  }
  // reuse existing getAllProducts() for the product picker in the Add modal

  public deleteBanner<T>(id: number): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.deleteBanner}/${id}`;
    return this.http.delete<T>(serviceURL, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
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
        return throwError(() => ({
          statusCode: 500,
          message: 'Delete Banner API error',
          error,
        }));
      }),
    );
  }

  // ---------------- Order detail (by order_id string) ----------------
  public getOrderByOrderId<T>(orderId: string): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.getOrderByOrderId}?order_id=${orderId}`;

    return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        if (error.status === 403) {
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['/auth/sign-in']);
        }
        if (
          error.error?.success === false &&
          error.error?.message == 'Session expired'
        ) {
          this.router.navigate(['/auth/sign-in']);
        }
        return throwError(() => ({
          statusCode: 500,
          message: 'Get Order API error',
          error,
        }));
      }),
    );
  }

  // ---------------- Update order status ----------------
  public updateOrderStatus<T>(orderId: string, status: string): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.updateOrderStatus}`;

    return this.http
      .put<T>(
        serviceURL,
        { order_id: orderId, status },
        { headers: this.getHeaders() },
      )
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['/auth/sign-in']);
          }
          if (
            error.error?.success === false &&
            error.error?.message == 'Session expired'
          ) {
            this.router.navigate(['/auth/sign-in']);
          }
          return throwError(() => ({
            statusCode: 500,
            message: 'Update Order Status API error',
            error,
          }));
        }),
      );
  }

  // ---------------- Delete order (admin, only CREATED orders) ----------------
  public deleteOrder<T>(orderId: string): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.deleteOrder}`;
    return this.http
      .delete<T>(serviceURL, {
        headers: this.getHeaders(),
        body: { order_id: orderId },
      })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['/auth/sign-in']);
          }
          if (
            error.error?.success === false &&
            error.error?.message == 'Session expired'
          ) {
            this.router.navigate(['/auth/sign-in']);
          }
          return throwError(() => ({
            statusCode: 500,
            message: 'Delete Order API error',
            error,
          }));
        }),
      );
  }

  public getAllCategoriesAdmin<T>(): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.getAllCategoriesAdmin}`;
    return this.http.get<T>(serviceURL, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        if (error.status === 403) {
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['/auth/sign-in']);
        }
        if (
          error.error?.success === false &&
          error.error?.message == 'Session expired'
        ) {
          this.router.navigate(['/auth/sign-in']);
        }
        return throwError(() => ({
          statusCode: 500,
          message: 'Get All Categories (admin) API error',
          error,
        }));
      }),
    );
  }

  public toggleCategoryActive<T>(categoryId: string): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.toggleCategoryActive}/${categoryId}/active`;
    return this.http
      .patch<T>(serviceURL, {}, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['/auth/sign-in']);
          }
          if (
            error.error?.success === false &&
            error.error?.message == 'Session expired'
          ) {
            this.router.navigate(['/auth/sign-in']);
          }
          return throwError(() => ({
            statusCode: 500,
            message: 'Toggle Category Active API error',
            error,
          }));
        }),
      );
  }

  public toggleProductActive<T>(id: number): Observable<T> {
    const serviceURL = `${this.urlHelper.getAPIURL()}${this.envUrl.toggleProductActive}/${id}/active`;
    return this.http
      .patch<T>(serviceURL, {}, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['/auth/sign-in']);
          }
          if (
            error.error?.success === false &&
            error.error?.message == 'Session expired'
          ) {
            this.router.navigate(['/auth/sign-in']);
          }
          return throwError(() => ({
            statusCode: 500,
            message: 'Toggle Product Active API error',
            error,
          }));
        }),
      );
  }
}
