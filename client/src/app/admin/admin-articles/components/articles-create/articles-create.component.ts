import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminArticlesService } from '../../admin-articles.service';

@Component({
  selector: 'app-articles-create',
  templateUrl: './articles-create.component.html',
  styleUrls: ['./articles-create.component.scss']
})
export class ArticlesCreateComponent implements OnInit {

  form: FormGroup
  articles

  constructor(
    private adminArticlesService: AdminArticlesService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(2000)]),
    });
  }

  submit(){
    const {title, body} = this.form.value
    // console.log(this.form.value)
    this.adminArticlesService.createArticle({title, body})
  }

  getAllArticles(){
    this.adminArticlesService.getAllArticles().subscribe(articles => {
      console.log(articles)
      this.articles = articles
    })
  }

}
