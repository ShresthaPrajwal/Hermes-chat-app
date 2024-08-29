import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  standalone: true
})
export class LogoComponent implements OnInit{

  @Input() width: string = '100px';
  @Input() height: string = 'auto';
  
  public isDarkMode: boolean = true;
  private themeSubscription!: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();
    this.themeService.loadTheme();

    this.themeSubscription = this.themeService.themeChanged.subscribe((isDarkMode)=>{
      this.isDarkMode = isDarkMode;
    })
  }

}
