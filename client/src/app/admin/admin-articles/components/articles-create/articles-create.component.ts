import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminArticlesService } from '../../admin-articles.service';
// import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-articles-create',
  templateUrl: './articles-create.component.html',
  styleUrls: ['./articles-create.component.scss']
})
export class ArticlesCreateComponent implements OnInit {

  form: FormGroup
  articles
  imagePreview

  constructor(
    private adminArticlesService: AdminArticlesService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(2000)]),
      image: new FormControl(null)
      // image: new FormControl(null, {
      //   validators: [Validators.required],
      //   asyncValidators: [mimeType]
      // })
    });
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      // console.log(reader.result);
      this.imagePreview = reader.result;
    };
    
    reader.readAsDataURL(file);
    // console.log(this.imagePreview)
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
