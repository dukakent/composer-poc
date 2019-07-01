import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class ChargeCarService {
  constructor(
    private readonly http: HttpClient
  ) {}


  chargeCar(car: any, station: any, chargeGoal) {
    return this.http.post(`${environment.blockchainServer}/ChargeCar`, {
      car: `resource:org.valor.evnet.Car#${car.carId}`,
      station: `resource:org.valor.evnet.ChargeStation#${station.stationId}`,
      chargeGoal
    });
  }
}
