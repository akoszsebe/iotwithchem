import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MdButtonModule,
  MdCardModule,
  MdDialogModule,
  MdIconModule,
  MdIconRegistry,
  MdInputModule,
  MdListModule,
  MdProgressSpinnerModule,
  MdSidenavModule,
  MdSlideToggleModule,
  MdTabsModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MdSlideToggleModule,
    MdInputModule,
    MdProgressSpinnerModule,
    MdDialogModule,
    MdSidenavModule,
    MdCardModule,
    MdListModule,
    MdButtonModule,
    MdIconModule,
    MdTabsModule
  ],
  exports: [
    MdSlideToggleModule,
    MdInputModule,
    MdProgressSpinnerModule,
    MdDialogModule,
    MdSidenavModule,
    MdCardModule,
    MdListModule,
    MdButtonModule,
    MdIconModule,
    MdTabsModule],
  declarations: [],
  providers: [MdIconRegistry]
})
export class CustomMdModule {
}
