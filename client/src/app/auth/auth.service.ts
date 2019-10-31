import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  getToken(){
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  SignIn(email, password){
    this.http.post<{token: string, status: any, user: any}>('http://localhost:3000/api/v1/users/login', {email, password}).subscribe(response => {
      console.log(response)
      const token = response.token
      this.token = token;
      console.log(token)
      if(token){
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }
      console.log(response)
    })
  }
  SignUp(name, email, password){
    this.http.post('http://localhost:3000/api/v1/users/signup', {name, email, password}).subscribe(response => {
      console.log(response)
    })
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/sign-up']);
  }
}
