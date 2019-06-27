import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class BuyElectricityService {
  constructor(private readonly http: HttpClient) {}


  buyElectricity(participantSeller: string, participantBuyer: string, sellerId: string, buyerId: string, amount: number) {
    return this.http.post(`${environment.blockchainServer}/BuyElectricity`, {
      seller: `resource:org.valor.evnet.${participantSeller}#${sellerId}`,
      buyer: `resource:org.valor.evnet.${participantBuyer}#${buyerId}`,
      amount
    });
  }
}
