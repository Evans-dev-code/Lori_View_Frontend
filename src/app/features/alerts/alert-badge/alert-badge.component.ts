import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-badge',
  template: `
    <span class="alert-badge" [class]="severity.toLowerCase()"
          *ngIf="count > 0">
      {{ count > 99 ? '99+' : count }}
    </span>
  `,
  styleUrls: ['./alert-badge.component.scss']
})
export class AlertBadgeComponent {
  @Input() count    = 0;
  @Input() severity = 'medium';
}