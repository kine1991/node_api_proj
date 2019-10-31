import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

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
export class MainHeaderComponent implements OnInit, OnDestroy {
  userIsAuth = false
  private authListenerSubs: Subscription;
  isOpen = false
  isAuthenticated = true

  items: ListMenu[] | [] = [
    { link: '/test', name: 'Test', icon: 'info' },
    { link: '/test2', name: 'Test2', icon: 'info' },
    { link: '/sign-in', name: 'Sign In', icon: '3d_rotation' },
    { link: '/sign-up', name: 'Sign Up'},
  ]
  itemsIsAuth: ListMenu[] = [
    { link: '/admin/create-article', name: 'Create Article', icon: 'info' },
  ]
  itemsNotIsAuth: ListMenu[] = [
    { link: '/admin/create-article', name: 'Create Article', icon: 'info' },
    { link: '/sign-in', name: 'Sign In', icon: '3d_rotation' },
    { link: '/sign-up', name: 'Sign Up'},
  ]

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.userIsAuth = isAuth;
    })

    // if(this.userIsAuth){
    //   console.log('1',this.userIsAuth)
    //   this.items = this.itemsIsAuth
    // } else{
    //   console.log('2',this.userIsAuth)
    //   this.items = this.itemsNotIsAuth 
    // }
    // console.log('this.userIsAuth', this.userIsAuth)
  }

  ngOnDestroy(){

  }

  toggle(){
    this.isOpen = ! this.isOpen
  }

  logout(){
    this.authService.logout()
  }

}
