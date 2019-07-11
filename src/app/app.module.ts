import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import {
    LaspAppModule,
    MaterialModule
} from './modules';
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
        HttpClientModule,
        LaspAppModule,
        MaterialModule,
        RouterModule.forRoot( routes )
    ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
