import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConverterComponent } from './converter/converter.component';
import { MaterialModule } from "./material/material.module";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartsComponent } from './charts/charts.component';
import { HeaderComponent } from './header/header.component';
@NgModule({
  declarations: [
    AppComponent,
    ConverterComponent,
    ChartsComponent,
    HeaderComponent,
  ],
  imports: [
   CommonModule,
   BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,

  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
