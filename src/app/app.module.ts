import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { LaspFooterModule } from 'lasp-footer';
import { LaspNavModule } from 'lasp-nav';

import { AppComponent } from './app.component';
import { MaterialModule } from './modules';
import { routes } from './routes';
import { Four04Component } from './four04/four04.component';

@NgModule({
    declarations: [
        AppComponent,
        Four04Component
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        FlexLayoutModule,
        LaspFooterModule,
        LaspNavModule,
        HttpClientModule,
        MaterialModule,
        RouterModule.forRoot( routes )
    ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
