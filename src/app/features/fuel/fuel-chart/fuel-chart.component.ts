import { Component, Input, OnChanges,
         AfterViewInit, OnDestroy } from '@angular/core';
import { FuelReading } from '../../../core/models/fuel.model';

@Component({
  selector: 'app-fuel-chart',
  templateUrl: './fuel-chart.component.html',
  styleUrls: ['./fuel-chart.component.scss']
})
export class FuelChartComponent implements
  AfterViewInit, OnChanges, OnDestroy {

  @Input() readings: FuelReading[] = [];
  @Input() capacity = 300;

  private chart: any;
  private initialized = false;

  ngAfterViewInit(): void {
    this.initialized = true;
    this.buildChart();
  }

  ngOnChanges(): void {
    if (this.initialized) this.buildChart();
  }

  ngOnDestroy(): void {
    if (this.chart) this.chart.destroy();
  }

  private async buildChart(): Promise<void> {
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);

    const canvas = document.getElementById(
      'fuel-chart-canvas'
    ) as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) this.chart.destroy();

    if (this.readings.length === 0) return;

    const labels = this.readings.map(r =>
      new Date(r.time).toLocaleDateString('en-KE',
        { month: 'short', day: 'numeric' }
      )
    );
    const data = this.readings.map(r => r.fuelLevelL);

    const isDark = document.documentElement
      .classList.contains('dark-theme');

    const gridColor = isDark
      ? 'rgba(255,255,255,0.06)'
      : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#94a3b8' : '#475569';

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label:           'Fuel level (L)',
            data,
            borderColor:     '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.08)',
            borderWidth:     2.5,
            fill:            true,
            tension:         0.4,
            pointRadius:     4,
            pointBackgroundColor: '#f59e0b'
          },
          {
            label:           'Tank capacity',
            data:            this.readings.map(() => this.capacity),
            borderColor:     'rgba(99,102,241,0.3)',
            borderWidth:     1.5,
            borderDash:      [6, 4],
            fill:            false,
            pointRadius:     0
          }
        ]
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: textColor, font: { size: 12 } }
          },
          tooltip: {
            callbacks: {
              label: ctx =>
                `${ctx.dataset.label}: ${ctx.parsed.y} L`
            }
          }
        },
        scales: {
          x: {
            grid:  { color: gridColor },
            ticks: { color: textColor, maxTicksLimit: 8 }
          },
          y: {
            grid:  { color: gridColor },
            ticks: { color: textColor,
                     callback: v => v + ' L' },
            min:   0,
            max:   this.capacity + 20
          }
        }
      }
    });
  }
}