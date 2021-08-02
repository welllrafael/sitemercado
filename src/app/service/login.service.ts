import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginResult } from '../model/loginResult';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly loginUrl = 'https://dev.sitemercado.com.br/api/login';

  constructor(private httpClient: HttpClient) { }

  login(username: string,password: string):
    Observable<loginResult> {
    // let username: string = '11234567890';
    // let password: string = '09876543211';
    const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password) });

    return this.httpClient
      .post<loginResult>(this.loginUrl,{},{headers});
  }
}
