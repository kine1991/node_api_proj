import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  getCars(){
    return this.http.get('http://localhost:3000/api/v1/cars')
    // .subscribe(cars => {
    //   console.log('cars')
    //   console.log(cars)
    // });
  }
}
