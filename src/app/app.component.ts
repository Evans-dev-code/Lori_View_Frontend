import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SharedModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isAuthPage       = false;
  sidebarCollapsed = false;
  mobileOpen       = false;
  isMobile         = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkMobile();
    this.isAuthPage = this.router.url.startsWith('/auth');

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.isAuthPage  = e.urlAfterRedirects.startsWith('/auth');
      // Close mobile sidebar on navigation
      this.mobileOpen  = false;
    });
  }

  @HostListener('window:resize')
  checkMobile(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.mobileOpen = false;
    }
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      this.mobileOpen = !this.mobileOpen;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  closeOverlay(): void {
    this.mobileOpen = false;
  }
}