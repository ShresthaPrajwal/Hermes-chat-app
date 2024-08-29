import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { ThemeToggleComponent } from './shared/components/theme-toggle/theme-toggle.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StyleClassModule } from 'primeng/styleclass';
import { CardModule } from 'primeng/card';
import { SocketIoModule } from 'ngx-socket-io';
import { socketConfig } from '../../environments/socket-config';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
import { AuthInterceptor } from './modules/interceptors/auth.interceptor';
@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    ThemeToggleComponent,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpClientModule,
    StyleClassModule,
    CardModule,
    SocketIoModule.forRoot(socketConfig)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
