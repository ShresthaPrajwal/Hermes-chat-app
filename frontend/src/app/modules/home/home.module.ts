import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatContentComponent } from './chat-content/chat-content.component';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    HomeComponent,
    SidebarComponent,
    ChatContentComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    InputTextModule,
    ListboxModule,
    ButtonModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
