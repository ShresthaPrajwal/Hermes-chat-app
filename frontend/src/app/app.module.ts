import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { ThemeToggleComponent } from './shared/components/theme-toggle/theme-toggle.component';
import { HttpClientModule } from '@angular/common/http';
import {StyleClassModule} from 'primeng/styleclass';
import { SocketIoModule } from 'ngx-socket-io';
import { socketConfig } from '../../environments/socket-config';
import { LogoComponent } from './shared/components/logo/logo.component';
@NgModule({
  declarations: [
    AppComponent,
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
    SocketIoModule.forRoot(socketConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
