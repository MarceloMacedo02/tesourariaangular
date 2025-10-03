import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Material modules
import { MatChipsModule } from '@angular/material/chips';

// Locale
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

// Translation
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { rootReducer } from './store/reducers';
import { environment } from '../environments/environment';
import { AuthGuard } from './guards/auth.guard';

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// App initializer function to set default language
export function appInitializerFactory(translate: TranslateService) {
  return () => {
    // Set the default language to Portuguese (Brazil)
    translate.setDefaultLang('br');
    // Use Portuguese (Brazil) as the current language
    translate.use('br').subscribe(
      () => {},
      (error) => {
        console.error('Error setting language to Portuguese (Brazil):', error);
        // Fallback to English if Portuguese is not available
        translate.use('en').subscribe(
          () => {},
          (err) => console.error('Error setting language to English:', err)
        );
      }
    );
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule,      // Needed for router-outlet
    AppRoutingModule,   // Routing module
    BrowserAnimationsModule, // Required for animations
    MatChipsModule, // Required for mat-chip and mat-chip-list
    StoreModule.forRoot(rootReducer, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    },
    AuthGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }