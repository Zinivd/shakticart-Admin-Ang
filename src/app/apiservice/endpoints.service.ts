import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {

  
  constructor() { }

  // login
  public SendSigninOTP = 'auth/login_otp'
  public verifyOTP = 'auth/verify_otp'

}
