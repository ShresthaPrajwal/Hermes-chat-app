import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private lightTheme = 'lara-light-blue';
  private darkTheme = 'lara-dark-blue';

  constructor() { }

  public switchTheme(isDarkMode: boolean): void {
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
    const theme = isDarkMode ? this.darkTheme : this.lightTheme;

    themeLink.href = `assets/themes/${theme}/theme.css`;
    localStorage.setItem('theme', theme);
  }

  public loadTheme(): void {
    const savedTheme = localStorage.getItem('theme') || this.lightTheme;
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
    themeLink.href = `assets/themes/${savedTheme}/theme.css`;
  }

  public isDarkMode(): boolean{
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === this.darkTheme;
  }
}
