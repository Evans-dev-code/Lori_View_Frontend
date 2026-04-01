import { Component, Input, OnChanges, OnDestroy,
         AfterViewInit, SimpleChanges } from '@angular/core';
import { Truck } from '../../../core/models/truck.model';

@Component({
  selector: 'app-live-map',
  templateUrl: './live-map.component.html',
  styleUrls: ['./live-map.component.scss']
})
export class LiveMapComponent implements
  AfterViewInit, OnChanges, OnDestroy {

  @Input() trucks: Truck[] = [];

  private map: any;
  private markers: any[] = [];
  private L: any;
  mapReady = false;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trucks'] && this.mapReady) {
      this.updateMarkers();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private async initMap(): Promise<void> {
    // Dynamically import Leaflet to avoid SSR issues
    this.L = await import('leaflet' as any);

    this.map = this.L.map('live-map-container', {
      center:      [-1.286389, 36.817223],
      zoom:        6,
      zoomControl: true
    });

    this.L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }
    ).addTo(this.map);

    this.mapReady = true;
    this.updateMarkers();
  }

  private updateMarkers(): void {
    if (!this.map || !this.L) return;

    // Clear existing markers
    this.markers.forEach(m => m.remove());
    this.markers = [];

    const validTrucks = this.trucks.filter(
      t => t.lastLatitude && t.lastLongitude
    );

    validTrucks.forEach(truck => {
      const icon = this.L.divIcon({
        className: '',
        html: `
          <div class="map-truck-marker ${truck.status.toLowerCase()}">
            <div class="mtm-inner">🚛</div>
            <div class="mtm-label">${truck.plateNumber}</div>
          </div>
        `,
        iconSize:   [80, 48],
        iconAnchor: [40, 48]
      });

      const marker = this.L.marker(
        [truck.lastLatitude!, truck.lastLongitude!],
        { icon }
      ).addTo(this.map);

      marker.bindPopup(`
        <div class="map-popup">
          <div class="mp-plate">${truck.plateNumber}</div>
          <div class="mp-row">
            <span>Make</span>
            <span>${truck.make} ${truck.model}</span>
          </div>
          <div class="mp-row">
            <span>Speed</span>
            <span>${truck.currentSpeedKmh ?? '—'} km/h</span>
          </div>
          <div class="mp-row">
            <span>Fuel</span>
            <span>${truck.currentFuelLevel ?? '—'} L</span>
          </div>
          <div class="mp-row">
            <span>Status</span>
            <span class="badge ${truck.status.toLowerCase()}">
              ${truck.status}
            </span>
          </div>
        </div>
      `);

      this.markers.push(marker);
    });

    // Fit map to all markers
    if (validTrucks.length > 0) {
      const group = this.L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.2));
    }
  }
}