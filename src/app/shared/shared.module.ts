import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule }        from '@angular/material/toolbar';
import { MatSidenavModule }        from '@angular/material/sidenav';
import { MatListModule }           from '@angular/material/list';
import { MatIconModule }           from '@angular/material/icon';
import { MatButtonModule }         from '@angular/material/button';
import { MatCardModule }           from '@angular/material/card';
import { MatTableModule }          from '@angular/material/table';
import { MatPaginatorModule }      from '@angular/material/paginator';
import { MatSortModule }           from '@angular/material/sort';
import { MatFormFieldModule }      from '@angular/material/form-field';
import { MatInputModule }          from '@angular/material/input';
import { MatSelectModule }         from '@angular/material/select';
import { MatDatepickerModule }     from '@angular/material/datepicker';
import { MatNativeDateModule }     from '@angular/material/core';
import { MatDialogModule }         from '@angular/material/dialog';
import { MatSnackBarModule }       from '@angular/material/snack-bar';
import { MatProgressSpinnerModule }from '@angular/material/progress-spinner';
import { MatProgressBarModule }    from '@angular/material/progress-bar';
import { MatChipsModule }          from '@angular/material/chips';
import { MatBadgeModule }          from '@angular/material/badge';
import { MatTooltipModule }        from '@angular/material/tooltip';
import { MatMenuModule }           from '@angular/material/menu';
import { MatTabsModule }           from '@angular/material/tabs';
import { MatDividerModule }        from '@angular/material/divider';
import { MatSlideToggleModule }    from '@angular/material/slide-toggle';

import { NavbarComponent }          from './components/navbar/navbar.component';
import { SidebarComponent }         from './components/sidebar/sidebar.component';
import { LoadingSpinnerComponent }  from './components/loading-spinner/loading-spinner.component';
import { TruckStatusBadgeComponent }from './components/truck-status-badge/truck-status-badge.component';

const MAT = [
  MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule,
  MatButtonModule, MatCardModule, MatTableModule, MatPaginatorModule,
  MatSortModule, MatFormFieldModule, MatInputModule, MatSelectModule,
  MatDatepickerModule, MatNativeDateModule, MatDialogModule,
  MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule,
  MatChipsModule, MatBadgeModule, MatTooltipModule, MatMenuModule,
  MatTabsModule, MatDividerModule, MatSlideToggleModule
];

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    LoadingSpinnerComponent,
    TruckStatusBadgeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ...MAT
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    SidebarComponent,
    LoadingSpinnerComponent,
    TruckStatusBadgeComponent,
    ...MAT
  ]
})
export class SharedModule { }