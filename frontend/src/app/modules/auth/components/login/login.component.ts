import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private UserService: UserService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  public login(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.loginUser(username, password).pipe(
        catchError(error => {
          this.errorMessage = 'Login failed. Please check your credentials and try again...';
          this.loginForm.reset();
          setTimeout(() => {
            this.errorMessage = ''
          }, 5000);
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          console.log('User logged in', response)
          this.UserService.setUserData({
            userId: response.userId,
            username: response.username,
            token: response.token,
            email: response.user.email,
            profilePicture: response.user.profilePicture,
            friends: response.user.friends,
            friendRequests: response.user.friendRequestsReceived,
            friendRequestsSent: response.user.friendRequestsSent
          });
          this.router.navigate(['/home/main']);
        }
      });
    }
  }

  public goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
