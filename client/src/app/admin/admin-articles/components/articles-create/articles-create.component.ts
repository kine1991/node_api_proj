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
    console.log(this.form.value)
    this.adminArticlesService.test()
  }

}
