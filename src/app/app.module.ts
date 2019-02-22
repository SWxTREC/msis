import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './modules';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchComponent } from './components/search/search.component';

import { DatasetService } from './services/datasets.service';
import { MissionService } from './services/mission.service';
import { SearchService } from './services/search.service';

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        NavbarComponent,
        SearchComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        FlexLayoutModule,
        HttpClientModule,
        MaterialModule
    ],
    providers: [
        DatasetService,
        MissionService,
        SearchService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
