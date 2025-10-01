import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';

// Language
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../core/services/language.service';

// Bootstap Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

// component
import { CustomizerComponent } from './customizer/customizer.component';
import { FooterComponent } from './footer/footer.component';
import { HorizontalTopbarComponent } from './horizontal-topbar/horizontal-topbar.component';
import { HorizontalComponent } from './horizontal/horizontal.component';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { TwoColumnSidebarComponent } from './two-column-sidebar/two-column-sidebar.component';
import { TwoColumnComponent } from './two-column/two-column.component';
import { VerticalComponent } from './vertical/vertical.component';

@NgModule({
  declarations: [
    LayoutComponent,
    TopbarComponent,
    SidebarComponent,
    VerticalComponent,
    FooterComponent,
    CustomizerComponent,
    HorizontalComponent,
    HorizontalTopbarComponent,
    TwoColumnComponent,
    TwoColumnSidebarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    SimplebarAngularModule,
    TranslateModule, // This will use the root configuration
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [LanguageService],
})
export class LayoutsModule {}
