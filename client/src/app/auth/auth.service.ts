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
  currentUserListener = new Subject();
  currentUser = null

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

  getCurrentUserListener(){
    return this.currentUserListener.asObservable();
  }

  getCurrentUser(){
    this.http.get<{user: any, status: any}>('http://localhost:3000/api/v1/users/getCurrentUser').subscribe(response => {
      // console.log('response - getCurrentUser')
      // console.log(response)
      this.currentUser = response.user
      this.currentUserListener.next(response.user)
    })
  }

  SignIn(email, password){
    this.http.post<{token: string, status: any, user: any}>('http://localhost:3000/api/v1/users/login', {email, password}).subscribe(response => {
      // console.log('response - signin')
      // console.log(response)
      // console.log(token)
      this.currentUser = response.user
      this.currentUserListener.next(response.user)
      const token = response.token
      this.token = token;
      if(token){
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.saveAuthData(token);
        this.router.navigate(['/']);
      }
      // console.log(response)
    })
  }
  SignUp(name, email, password){
    this.http.post('http://localhost:3000/api/v1/users/signup', {name, email, password}).subscribe(response => {
      // console.log(response)
    })
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    // console.log(authInformation);
    if(this.getAuthData()){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);

    }

  }

  logout(){
    // this.currentUserListener.next(response.user)
    this.token = null;
    this.isAuthenticated = false;
    this.currentUserListener.next(null)
    this.authStatusListener.next(false);
    this.clearAuthdata();
    this.router.navigate(['/sign-up']);
  }

  private saveAuthData(token: string){
    localStorage.setItem('token', token);
  }

  private clearAuthdata(){
    localStorage.removeItem('token');
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    if(!token){
      return;
    }
    return {
      token: token
    }
  }

  signInWithGoogle(){
    this.autoAuthUser()
  }
}
