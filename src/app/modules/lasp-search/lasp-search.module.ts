import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import {
    // MatAutocompleteModule,
    // MatBadgeModule,
    // MatBottomSheetModule,
    MatButtonModule,
    // MatButtonToggleModule,
    // MatCardModule,
    // MatCheckboxModule,
    // MatChipsModule,
    // MatDatepickerModule,
    // MatDialogModule,
    // MatDividerModule,
    // MatExpansionModule,
    // MatGridListModule,
    MatIconModule,
    // MatInputModule,
    // MatListModule,
    // MatMenuModule,
    // MatNativeDateModule,
    // MatPaginatorModule,
    // MatProgressBarModule,
    // MatProgressSpinnerModule,
    // MatRadioModule,
    // MatRippleModule,
    // MatSelectModule,
    // MatSidenavModule,
    // MatSliderModule,
    // MatSlideToggleModule,
    // MatSnackBarModule,
    // MatSortModule,
    // MatStepperModule,
    // MatTableModule,
    // MatTabsModule,
    // MatToolbarModule,
    // MatTooltipModule,
    // MatTreeModule,
} from '@angular/material';

import { LaspSearchComponent } from './lasp-search.component';

@NgModule({
    declarations: [
        LaspSearchComponent
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        MatButtonModule,
        MatIconModule
    ],
    exports: [
        LaspSearchComponent
    ]
})
export class LaspSearchModule { }
