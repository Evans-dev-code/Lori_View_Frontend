import { Component, Input, OnChanges } from '@angular/core';
import { Truck, TruckStatus } from '../../../core/models/truck.model';
import { Trip, TripStatus } from '../../../core/models/trip.model';
import { Alert, AlertSeverity } from '../../../core/models/alert.model';

@Component({
  selector: 'app-fleet-summary',
  templateUrl: './fleet-summary.component.html',
  styleUrls: ['./fleet-summary.component.scss']
})
export class FleetSummaryComponent implements OnChanges {

  @Input() trucks: Truck[] = [];
  @Input() trips:  Trip[]  = [];
  @Input() alerts: Alert[] = [];

  summaryItems: any[] = [];

  ngOnChanges(): void {
    this.buildSummary();
  }

  buildSummary(): void {
    const active      = this.trucks.filter(t => t.status === TruckStatus.ACTIVE).length;
    const maintenance = this.trucks.filter(t => t.status === TruckStatus.MAINTENANCE).length;
    const inactive    = this.trucks.filter(t => t.status === TruckStatus.INACTIVE).length;
    const ongoing     = this.trips.filter(t => t.status === TripStatus.ONGOING).length;
    const completed   = this.trips.filter(t => t.status === TripStatus.COMPLETED).length;
    const critical    = this.alerts.filter(a =>
      a.severity === AlertSeverity.CRITICAL
    ).length;
    const high        = this.alerts.filter(a =>
      a.severity === AlertSeverity.HIGH
    ).length;

    this.summaryItems = [
      {
        label: 'Active trucks',
        value: active,
        total: this.trucks.length,
        color: 'var(--success)',
        bg:    'var(--success-dim)',
        icon:  '🟢'
      },
      {
        label: 'In maintenance',
        value: maintenance,
        total: this.trucks.length,
        color: 'var(--warning)',
        bg:    'var(--warning-dim)',
        icon:  '🔧'
      },
      {
        label: 'Ongoing trips',
        value: ongoing,
        total: this.trips.length,
        color: 'var(--info)',
        bg:    'var(--info-dim)',
        icon:  '🗺️'
      },
      {
        label: 'Trips completed',
        value: completed,
        total: this.trips.length,
        color: 'var(--success)',
        bg:    'var(--success-dim)',
        icon:  '✅'
      },
      {
        label: 'Critical alerts',
        value: critical,
        total: this.alerts.length,
        color: 'var(--danger)',
        bg:    'var(--danger-dim)',
        icon:  '🔴'
      },
      {
        label: 'High alerts',
        value: high,
        total: this.alerts.length,
        color: 'var(--warning)',
        bg:    'var(--warning-dim)',
        icon:  '🟡'
      }
    ];
  }

  percent(value: number, total: number): number {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  }
}