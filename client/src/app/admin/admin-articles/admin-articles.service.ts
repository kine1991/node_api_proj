import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminArticlesService {

  constructor(
    private http: HttpClient
  ) { }

  createArticle(data){
    return this.http.post('http://localhost:3000/api/v1/articles', data).subscribe(x => console.log('xx',x))
  }

  getAllArticles(){
    return this.http.get('http://localhost:3000/api/v1/articles')
  }

  test(){
    console.log('test AdminArticlesService')
  }
}
