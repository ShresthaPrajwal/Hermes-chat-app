import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../auth/services/user.service';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit{
  public username: string = '';
  public profilePicture: string = '';

  constructor(private userService: UserService){}

  ngOnInit(): void {
    this.username = this.userService.getUsername();
    this.profilePicture = this.userService.getProfilePicture();
  }
}
