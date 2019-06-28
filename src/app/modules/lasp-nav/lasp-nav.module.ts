import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import {
    // MatAutocompleteModule,
    // MatBadgeModule,
    // MatBottomSheetModule,
    // MatButtonModule,
    // MatButtonToggleModule,
    MatCardModule,
    // MatCheckboxModule,
    // MatChipsModule,
    // MatDatepickerModule,
    // MatDialogModule,
    // MatDividerModule,
    // MatExpansionModule,
    // MatGridListModule,
    MatIconModule,
    // MatInputModule,
    MatListModule,
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
    MatToolbarModule,
    // MatTooltipModule,
    // MatTreeModule,
} from '@angular/material';

import { LaspSearchModule } from '../lasp-search/lasp-search.module';

import { LaspNavComponent } from './lasp-nav.component';

@NgModule({
    declarations: [
        LaspNavComponent
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatCardModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        LaspSearchModule,
        RouterModule
    ],
    exports: [
        LaspNavComponent
    ]
})
export class LaspNavModule { }
