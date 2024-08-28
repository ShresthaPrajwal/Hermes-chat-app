import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../auth/services/user.service';
import { TabService } from '../../services/tab/tab.service';
import { Router } from '@angular/router';
import { UsersService } from '../../services/user/users.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  public username: string = '';
  public profilePicture: string = '';
  public displayLogoutDialog: boolean = false;
  public displayEditProfileDialog: boolean = false;
  public newProfilePictureFile: File | null = null;

  constructor(
    private userService: UserService,
    private usersService: UsersService,
    public tabService: TabService,
    private router: Router
  ) { }

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

  public openEditProfileDialog(): void {
    this.displayEditProfileDialog = true;
  }

  public onProfilePictureSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.newProfilePictureFile = file;
    }
  }

  public updateProfilePicture(): void {
    if (this.newProfilePictureFile) {
      try {
        const updatedUser = this.usersService.updateProfilePicture(this.userService.getUserId(),this.newProfilePictureFile).subscribe(newProfileResponse=>{
          console.log('New Profile response',newProfileResponse);
        this.profilePicture = newProfileResponse.user.profilePicture;
          
        });
        this.displayEditProfileDialog = false;
      } catch (error) {
        console.error('Error updating profile picture:', error);
      }
    }
  }
}
