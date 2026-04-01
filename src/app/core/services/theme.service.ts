import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly KEY = 'loriview_theme';
  private darkMode = new BehaviorSubject<boolean>(false);

  isDark$ = this.darkMode.asObservable();

  constructor() {
    // Restore saved preference on app load
    const saved = localStorage.getItem(this.KEY);
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    this.apply(isDark);
  }

  toggle(): void {
    this.apply(!this.darkMode.value);
  }

  isDark(): boolean {
    return this.darkMode.value;
  }

  private apply(dark: boolean): void {
    this.darkMode.next(dark);
    if (dark) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
    localStorage.setItem(this.KEY, dark ? 'dark' : 'light');
  }
}