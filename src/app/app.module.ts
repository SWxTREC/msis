import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    LaspAppModule,
    MaterialModule
 } from './modules';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// App Initialization
import { routes } from './routes';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent,
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
    bootstrap: [AppComponent]
})
export class AppModule { }
