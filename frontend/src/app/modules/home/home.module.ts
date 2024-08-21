import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatContentComponent } from './chat-content/chat-content.component';



@NgModule({
  declarations: [
    HomeComponent,
    SidebarComponent,
    ChatContentComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
