import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

import { MaterialModule } from '../../modules';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';


@NgModule({
    imports: [
        CommonModule,
        MarkdownModule.forRoot({ loader: HttpClient }),
        MaterialModule,
        AboutRoutingModule
    ],
    declarations: [ AboutComponent ]
})
export class AboutModule { }
