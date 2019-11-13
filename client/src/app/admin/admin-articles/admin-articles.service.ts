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
    const articleData = new FormData();
    articleData.append("title", data.title);
    articleData.append("body", data.body);
    articleData.append("image", data.image);
    console.log(articleData)
    // articleData.append("image", data.image, data.title);

    return this.http.post('http://localhost:3000/api/v1/articles', articleData).subscribe(x => console.log('xx',x))
  }

  getAllArticles(){
    return this.http.get('http://localhost:3000/api/v1/articles')
  }

  test(){
    console.log('test AdminArticlesService')
  }
}
