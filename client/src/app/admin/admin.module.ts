import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCarsComponent } from './admin-cars/admin-cars.component';
import { CarsCreateComponent } from './admin-cars/components/cars-create/cars-create.component';
import { CarsDashboardComponent } from './admin-cars/components/cars-dashboard/cars-dashboard.component';
import { AdminHeaderComponent } from './shared/components/admin-header/admin-header.component';
import { AdminLayoutComponent } from './shared/components/admin-layout/admin-layout.component';
import { AdminArticlesComponent } from './admin-articles/components/admin-articles/admin-articles.component';
import { ArticlesCreateComponent } from './admin-articles/components/articles-create/articles-create.component';
import { ArticlesDashboardComponent } from './admin-articles/components/articles-dashboard/articles-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [AdminCarsComponent, CarsCreateComponent, CarsDashboardComponent, AdminHeaderComponent, AdminLayoutComponent, AdminArticlesComponent, ArticlesCreateComponent, ArticlesDashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: AdminLayoutComponent, children: [
        {path: '', redirectTo: '/admin/articles-dashboard', pathMatch: 'full'},
        {path: 'articles-dashboard', component: ArticlesDashboardComponent},
        {path: 'articles-create', component: ArticlesCreateComponent},

      ]}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AdminModule { }
