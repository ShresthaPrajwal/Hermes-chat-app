import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../auth/services/user.service';
import { TabService } from '../../services/tab/tab.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit{
  public username: string = '';
  public profilePicture: string = '';

  constructor(private userService: UserService, public tabService: TabService){}

  ngOnInit(): void {
    this.username = this.userService.getUsername();
    this.profilePicture = this.userService.getProfilePicture();
  }

  public selectTab(tab: string): void{
    this.tabService.setSelectedTab(tab)
  }
}
