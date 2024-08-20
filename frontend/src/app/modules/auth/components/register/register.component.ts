// src/app/auth/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth-services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  private passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  public register(): void {
    if (this.registerForm.valid) {
      const { username, password } = this.registerForm.value;
      this.authService.registerUser(username, password).subscribe(response => {
        console.log('Registration successful', response);
      }, error => {
        console.error('Registration failed', error);
      });
    }
  }

  public goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
