import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../auth/services/user.service';
import { TabService } from '../../services/tab/tab.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  public username: string = '';
  public profilePicture: string = '';
  public displayLogoutDialog: boolean = false;

  constructor(
    private userService: UserService,
    public tabService: TabService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.userService.getUsername();
    this.profilePicture = this.userService.getProfilePicture();
  }

  public selectTab(tab: string): void {
    this.tabService.setSelectedTab(tab);
  }

  public confirmLogout(): void {
    this.displayLogoutDialog = true;
  }

  public logout(): void {
    this.userService.clearUserData();
    this.displayLogoutDialog = false;
    this.router.navigate(['/auth/login']);
  }
}
