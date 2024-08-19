import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth-services/auth.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
