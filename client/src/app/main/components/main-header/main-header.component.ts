import { Component, OnInit } from '@angular/core';

export interface ListMenu {
  link: string;
  name: string;
  icon?: string;
}

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  isOpen = false
  isAuthenticated = true
  authSubscription
  items: ListMenu[] = [
    { link: '/admin/create-article', name: 'Create Article', icon: 'info' },
    { link: '/signin', name: 'Sign In', icon: '3d_rotation' },
    { link: '/articles', name: 'Articles'},
  ]

  constructor() { }

  ngOnInit() {
  }

  toggle(){
    this.isOpen = ! this.isOpen
  }

}
