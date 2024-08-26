import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule]
})
export class ThemeToggleComponent {
  public isDarkMode: boolean;

  constructor(private themeService: ThemeService) {
    this.isDarkMode = this.themeService.isDarkMode();
    this.themeService.loadTheme();
  }

  public toggleDarkMode(): void {
    console.log('clicked theme button')
    this.isDarkMode = !this.isDarkMode;
    this.themeService.switchTheme(this.isDarkMode);
  }
}
