import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseUrlsService {
  // private readonly BASE_URL = 'http://192.168.88.7:5000';
  // private readonly BASE_URL = 'http://127.0.0.1:5000';
  private readonly BASE_URL = 'https://picklism-dev.fourdotz.com';

  public getAPIURL(): string {
    return `${this.BASE_URL}/api/`;
  }

  // public getSocketURL(): string {
  //   return this.BASE_URL;
  // }

  public getAPIURLdownload(): string {
    return 'https://picklism-dev.fourdotz.com/';
  }
}