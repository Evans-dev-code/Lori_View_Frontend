import { Component, OnInit, Input,
         Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input()  sidebarCollapsed = false;
  @Output() toggleSidebar    = new EventEmitter<void>();

  isDark       = false;
  unreadAlerts = 0;
  pageTitle    = 'Dashboard';

  private titles: Record<string, string> = {
    '/dashboard':    'Dashboard',
    '/trucks':       'Fleet Management',
    '/trips':        'Trip History',
    '/fuel':         'Fuel Analytics',
    '/alerts':       'Alerts',
    '/subscription': 'Subscription',
    '/admin':        'Admin Panel'
  };

  constructor(
    public  themeService: ThemeService,
    public  authService:  AuthService,
    private alertService: AlertService,
    private router:       Router
  ) {}

  ngOnInit(): void {
    this.themeService.isDark$.subscribe(d => this.isDark = d);

    this.updateTitle(this.router.url);
    this.router.events.subscribe(() => {
      this.updateTitle(this.router.url);
    });

    this.loadUnreadCount();
  }

  private loadUnreadCount(): void {
    const ownerId = this.authService.getOwnerId();
    if (!ownerId) return;
    this.alertService.getUnreadCount(ownerId).subscribe({
      next: count => this.unreadAlerts = count,
      error: ()   => this.unreadAlerts = 0
    });
  }

  private updateTitle(url: string): void {
    const match   = Object.keys(this.titles).find(k => url.startsWith(k));
    this.pageTitle = match ? this.titles[match] : 'LoriView';
  }

  toggleTheme(): void { this.themeService.toggle(); }

  get userName(): string {
    const name = this.authService.getCurrentUser()?.fullName || '';
    return name.split(' ')[0];
  }

  get userInitials(): string {
    const name = this.authService.getCurrentUser()?.fullName || 'U';
    return name.split(' ')
      .map((n: string) => n[0])
      .join('').toUpperCase().slice(0, 2);
  }

  get accountStatus(): string {
    return this.authService.getCurrentUser()?.accountStatus || 'TRIAL';
  }

  get isTrial(): boolean {
    return this.accountStatus === 'TRIAL';
  }

  get trialDays(): number {
    return this.authService.getCurrentUser()?.trialDaysRemaining || 0;
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToAlerts(): void {
    this.router.navigate(['/alerts']);
  }

  goToSubscription(): void {
    this.router.navigate(['/subscription']);
  }
}