import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
    private router: Router
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
          setTimeout(()=>{
            this.errorMessage = ''
          },5000);
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          console.log('Login successful', response);
          this.router.navigate(['/']);
        }
      });
    }
  }

  public goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
