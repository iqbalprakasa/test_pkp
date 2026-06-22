import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../guards/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}
  url = Config.get().apiBackend
  login(data: any) {
    return this.http.post(
      this.url +'auth/login',
      data
    );
  }
}