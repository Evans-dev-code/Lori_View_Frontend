import { Component, Input, OnChanges,
         AfterViewInit, OnDestroy } from '@angular/core';
import { LocationPing } from '../../../core/models/location-ping.model';

@Component({
  selector: 'app-trip-map',
  templateUrl: './trip-map.component.html',
  styleUrls: ['./trip-map.component.scss']
})
export class TripMapComponent implements
  AfterViewInit, OnChanges, OnDestroy {

  @Input() pings:       LocationPing[] = [];
  @Input() origin:      string = '';
  @Input() destination: string = '';

  private map: any;
  private L:   any;
  mapReady = false;

  ngAfterViewInit(): void { this.initMap(); }

  ngOnChanges(): void {
    if (this.mapReady && this.pings.length > 0) {
      this.drawRoute();
    }
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  private async initMap(): Promise<void> {
    this.L = await import('leaflet' as any);

    this.map = this.L.map('trip-map-container', {
      center:      [-1.286389, 36.817223],
      zoom:        6,
      zoomControl: true
    });

    this.L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '© OpenStreetMap contributors', maxZoom: 18 }
    ).addTo(this.map);

    this.mapReady = true;
    if (this.pings.length > 0) this.drawRoute();
  }

  private drawRoute(): void {
    if (!this.map || !this.L || this.pings.length === 0) return;

    const coords = this.pings.map(
      p => [p.latitude, p.longitude] as [number, number]
    );

    // Draw route line
    this.L.polyline(coords, {
      color:  '#f59e0b',
      weight: 4,
      opacity: 0.85
    }).addTo(this.map);

    // Start marker
    this.L.marker(coords[0], {
      icon: this.createIcon('🟢', this.origin || 'Start')
    }).addTo(this.map);

    // End marker
    if (coords.length > 1) {
      this.L.marker(coords[coords.length - 1], {
        icon: this.createIcon('🔴', this.destination || 'End')
      }).addTo(this.map);
    }

    // Fit bounds
    const group = this.L.polyline(coords);
    this.map.fitBounds(group.getBounds().pad(0.15));
  }

  private createIcon(emoji: string, label: string): any {
    return this.L.divIcon({
      className: '',
      html: `
        <div class="route-endpoint">
          <div class="re-dot">${emoji}</div>
          <div class="re-label">${label}</div>
        </div>
      `,
      iconSize:   [100, 44],
      iconAnchor: [50, 44]
    });
  }
}