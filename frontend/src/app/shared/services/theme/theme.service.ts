import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private lightTheme: string = 'lara-light-blue';
  private darkTheme: string = 'lara-dark-blue';
  public themeChanged: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  public switchTheme(isDarkMode: boolean): void {
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
    const theme = isDarkMode ? this.darkTheme : this.lightTheme;

    themeLink.href = `assets/themes/${theme}/theme.css`;
    localStorage.setItem('theme', theme);
    this.themeChanged.next(isDarkMode);
  }

  public loadTheme(): void {
    const savedTheme = localStorage.getItem('theme') || this.lightTheme;
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
    themeLink.href = `assets/themes/${savedTheme}/theme.css`;
    this.themeChanged.next(savedTheme === this.darkTheme);
  }

  public isDarkMode(): boolean {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === this.darkTheme;
  }
}

