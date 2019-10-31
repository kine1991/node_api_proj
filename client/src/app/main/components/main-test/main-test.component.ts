import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main-test',
  templateUrl: './main-test.component.html',
  styleUrls: ['./main-test.component.scss']
})
export class MainTestComponent implements OnInit {

  cars = []
  length

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.http.get('http://localhost:3000/api/v1/cars').subscribe(cars => {
      this.cars = cars.data.data
      // this.length = cars.data.data.length
      // console.log(cars)
      // console.log(cars.data.data)
    })
  }

}
