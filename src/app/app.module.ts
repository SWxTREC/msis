import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { LaspFooterModule } from 'lasp-footer';
import { LaspFour04Module } from 'lasp-four04';
import { LaspNavModule } from 'lasp-nav';

import { AppComponent } from './app.component';
import { MaterialModule } from './modules';
import { routes } from './routes';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        FlexLayoutModule,
        LaspFooterModule,
        LaspFour04Module,
        LaspNavModule,
        HttpClientModule,
        MaterialModule,
        RouterModule.forRoot( routes, { scrollPositionRestoration: 'enabled' } )
    ],
    providers: [
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { appearance: 'outline' }
        }
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
