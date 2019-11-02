import { Component, OnInit } from '@angular/core';
import { CarsService } from '../cars.service';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {
  cars 

  constructor(
    private carsService: CarsService
  ) { }

  ngOnInit() {
    this.carsService.getCars().subscribe(cars => {
        console.log('cars')
        console.log(cars)
        this.cars = cars
    })
  }

}
