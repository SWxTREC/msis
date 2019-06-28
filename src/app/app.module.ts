import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    LaspNavModule,
    MaterialModule
 } from './modules';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// App Initialization
import { routes } from './routes';
import { AppComponent } from './app.component';

// Components
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        FlexLayoutModule,
        HttpClientModule,
        LaspNavModule,
        MaterialModule,
        RouterModule.forRoot( routes )
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
