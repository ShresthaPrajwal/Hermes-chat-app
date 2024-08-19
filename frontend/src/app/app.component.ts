import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth-services/auth.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.loginUser('Pk', '1245').pipe(
      catchError((err) => {
        return throwError(() => {
          console.log(err);
        })
      })
    ).subscribe((res) => {
      console.log('Response:', res)
    })
  }
}
