import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
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
    // MatIconModule,
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
    MatToolbarModule,
    // MatTooltipModule,
    // MatTreeModule,
} from '@angular/material';

export {
    // INavItem, uncomment this line if you are using the LaspFooterComponent without the LaspNavComponent
    IImageLink,
    ISocialLinks
} from './models';
import { LaspFooterComponent } from './lasp-footer.component';


@NgModule({
    declarations: [LaspFooterComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatToolbarModule,
        RouterModule
    ],
    exports: [LaspFooterComponent]
})
export class LaspFooterModule { }
