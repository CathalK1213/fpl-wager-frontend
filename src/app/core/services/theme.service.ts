import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'fpl_theme';
  isDark = true;

  init(): void {
    const saved = localStorage.getItem(this.THEME_KEY);
    this.isDark = saved ? saved === 'dark' : true;
    this.apply();
  }

  toggle(): void {
    this.isDark = !this.isDark;
    localStorage.setItem(this.THEME_KEY, this.isDark ? 'dark' : 'light');
    this.apply();
  }

  private apply(): void {
    if (this.isDark) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }
}
