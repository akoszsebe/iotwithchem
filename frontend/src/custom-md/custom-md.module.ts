import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSidenavModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSnackBarModule
  ],
  exports: [
    MatSlideToggleModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSidenavModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSnackBarModule],
  declarations: [],
  providers: [MatIconRegistry]
})
export class CustomMatModule {
}
