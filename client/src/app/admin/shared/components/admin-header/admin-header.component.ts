import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  isOpen = true

  items = [
    { link: '/admin/articles-dashboard', name: 'Dashboard' },
    { link: '/admin/articles-dashboard', name: 'Create' },
  ]

  constructor(
    private router: Router,
    // public auth: AuthService
  ) { }

  ngOnInit() {
  } 

  toggle(){
    this.isOpen = !this.isOpen
  }

  isAuthenticated(){
    return true
  }

}
