import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-truck-status-badge',
  template: `
    <span class="badge" [class]="status.toLowerCase()">
      {{ status | titlecase }}
    </span>
  `,
  styleUrls: ['./truck-status-badge.component.scss']
})
export class TruckStatusBadgeComponent {
  @Input() status = 'ACTIVE';
}