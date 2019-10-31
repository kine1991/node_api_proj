import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  SignIn(email, password){
    this.http.post('http://localhost:3000/api/v1/users/login', {email, password}).subscribe(x => console.log(x))
  }
  SignUp(name, email, password){
    this.http.post('http://localhost:3000/api/v1/users/signup', {name, email, password}).subscribe(x => console.log(x))
  }
}
