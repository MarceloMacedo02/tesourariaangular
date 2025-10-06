import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// component
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { TitleCasePipe } from '../pipes/titlecase.pipe';

@NgModule({
  declarations: [
    BreadcrumbsComponent,
    TitleCasePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    BreadcrumbsComponent,
    TitleCasePipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
