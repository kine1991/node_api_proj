import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    console.log('xooop')
    this.http.get('http://localhost:3000/api/v1/cars').subscribe(x => {
      console.log('x',x)
    })
    // fetch('http://localhost:3000/api/v1/cars')
    // .then(x => console.log('x', x.json()))
    // .catch(err => console.log('err', err))
  }

}
