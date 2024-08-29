import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChatContentComponent } from './components/chat-content/chat-content.component';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import { ChatSkeletonComponent } from '../../shared/components/skeleton/chat-skeleton/chat-skeleton.component';
@NgModule({
  declarations: [
    HomeComponent,
    SidebarComponent,
    ChatContentComponent,
    SidenavComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    InputTextModule,
    ListboxModule,
    ButtonModule,
    FormsModule,
    SidebarModule,
    MenuModule,
    DialogModule,
    MultiSelectModule,
    CardModule,
    ThemeToggleComponent,
    LogoComponent,
    ChatSkeletonComponent
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
