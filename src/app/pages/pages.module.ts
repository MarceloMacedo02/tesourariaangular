import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Page Route
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LayoutsModule } from '../layouts/layouts.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    LayoutsModule
  ]
})
export class PagesModule { }
