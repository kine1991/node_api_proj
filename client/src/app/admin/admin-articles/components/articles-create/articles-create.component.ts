import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminArticlesService } from '../../admin-articles.service';
import { environment } from '../../../../../environments/environment'

// import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-articles-create',
  templateUrl: './articles-create.component.html',
  styleUrls: ['./articles-create.component.scss']
})
export class ArticlesCreateComponent implements OnInit {

  form: FormGroup
  articles
  imagesPreview
  url = environment.url

  constructor(
    private adminArticlesService: AdminArticlesService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(2000)]),
      images: new FormControl(null)
      // image: new FormControl(null, {
      //   validators: [Validators.required],
      //   asyncValidators: [mimeType]
      // })
    });
  }
  
  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({images: file});
    this.form.get('images').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagesPreview = reader.result;
    };
    
    reader.readAsDataURL(file);
  }

  submit(){
    console.log(this.form.value)
    const {title, body, images} = this.form.value
    this.adminArticlesService.createArticle({title, body, images})
  }

  getAllArticles(){

    this.adminArticlesService.getAllArticles().subscribe(articles => {
      // console.log(articles)
      this.articles = articles
    })
  }

  getImagesPreview(){
    // console.log(this.imagesPreview)
    console.log('this.imagesPreview',this.imagesPreview)
    // console.log('file', file)
  }

}
