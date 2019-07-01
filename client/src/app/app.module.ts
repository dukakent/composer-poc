import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CONTAINERS } from './containers';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { COMPONENTS } from './components';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddCarComponent } from './components/add-car/add-car.component';
import { BuyEVCoinsComponent } from './components/buy-evcoins/buy-evcoins.component';
import { ChargeCarComponent } from './components/charge-car/charge-car.component';

@NgModule({
  declarations: [
    AppComponent,
    ...CONTAINERS,
    ...COMPONENTS
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AddCarComponent, BuyEVCoinsComponent]
})
export class AppModule { }
