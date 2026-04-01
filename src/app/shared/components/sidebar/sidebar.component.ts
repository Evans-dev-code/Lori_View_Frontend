import {
  Component, OnInit, Output, EventEmitter, Input
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  icon:      string;
  label:     string;
  route:     string;
  badge?:    number;
  section?:  string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input()  collapsed  = false;
  @Input()  mobileOpen = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  activeRoute = '';

  private ownerNavItems: NavItem[] = [
  {
    section: 'Overview',
    icon:    'dashboard',
    label:   'Dashboard',
    route:   '/dashboard'
  },
  {
    section: 'Fleet',
    icon:    'local_shipping',
    label:   'Trucks',
    route:   '/trucks'
  },
  {
    icon:  'route',
    label: 'Trips',
    route: '/trips'
  },
  {
    icon:  'local_gas_station',
    label: 'Fuel',
    route: '/fuel'
  },
  {
    icon:  'notifications',
    label: 'Alerts',
    route: '/alerts'
  },
  {
    section: 'Account',
    icon:    'person',
    label:   'Profile',
    route:   '/profile'
  },
  {
    icon:  'credit_card',
    label: 'Subscription',
    route: '/subscription'
  }
];

private adminNavItems: NavItem[] = [
  {
    section: 'Overview',
    icon:    'dashboard',
    label:   'Dashboard',
    route:   '/admin'
  },
  {
    section: 'Management',
    icon:    'people',
    label:   'All owners',
    route:   '/admin/owners'
  },
  {
    icon:  'payment',
    label: 'All payments',
    route: '/admin/payments'
  },
  {
    section: 'Account',
    icon:    'manage_accounts',
    label:   'Profile',
    route:   '/profile'
  }
];

get navItems(): NavItem[] {
  return this.authService.isAdmin()
    ? this.adminNavItems
    : this.ownerNavItems;
}

  constructor(
    private router:      Router,
    public  authService: AuthService
  ) {}

  ngOnInit(): void {
    this.activeRoute = this.router.url;
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.activeRoute = e.urlAfterRedirects;
    });
  }


  isActive(route: string): boolean {
    return this.activeRoute.startsWith(route);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void { this.authService.logout(); }

  get userName(): string {
    return this.authService.getCurrentUser()?.fullName || 'Owner';
  }

  get userInitials(): string {
    return this.userName.split(' ')
      .map(n => n[0]).join('')
      .toUpperCase().slice(0, 2);
  }

  get userEmail(): string {
    return this.authService.getCurrentUser()?.email || '';
  }
}