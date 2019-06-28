import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class WalletService {
  constructor(private readonly http: HttpClient) {}

  updateWallet(walletId: string, newData: any) {
    return this.http.put(`${environment.blockchainServer}/EVCoinWallet/${walletId}`, newData);
  }
}
