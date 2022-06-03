import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { RouterModule } from '@angular/router';
import { HOME_ROUTES } from './home-page-routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../modules/vendors/material.module';
import { SearchFieldModule } from '../../components/shared/search-field/search-field.module';
import { SidebarModule } from '../../components/shared/sidebar/sidebar.module';
import { FeedTableModule } from '../../components/shared/feed-table/feed-table.module';

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES),
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SearchFieldModule,
    FeedTableModule,
    SidebarModule,
  ],
  exports: [],
})
export class HomePageModule {
}
