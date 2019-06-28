import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';
import { randomId } from '../helpers/random-id.helper';

@Injectable({providedIn: 'root'})
export class ChargesService {
  allCompanies$ = new BehaviorSubject([]);

  constructor(private readonly http: HttpClient) {}

  getChargeStationOwner(id: string) {
    return this.http.get(`${environment.blockchainServer}/ChargeStationOwner/${id}`).pipe(
      switchMap((owner: any) => {
        const counterId = owner.electricity.split('#')[1];
        const walletId = owner.wallet.split('#')[1];

        return forkJoin(
          this.http.get(`${environment.blockchainServer}/ElectricityCounter/${counterId}`),
          this.http.get(`${environment.blockchainServer}/EVCoinWallet/${walletId}`)
        ).pipe(
          map(([counter, wallet]: any) => {
            owner.electricity = counter;
            owner.wallet = wallet;

            return owner;
          })
        );

      })
    );
  }

  createChargeStationCompany(name: string) {
    return this.http.post(`${environment.blockchainServer}/CreateChargeStationOwner`, {name});
  }

  refreshCompanies() {
    this.http.get(`${environment.blockchainServer}/ChargeStationOwner`).pipe(
      tap(owners => this.allCompanies$.next(owners as any)),
      switchMap(from as any)
    ).subscribe(owner => {
      const counterId = owner.electricity.split('#')[1];
      const walletId = owner.wallet.split('#')[1];

      this.http.get(`${environment.blockchainServer}/ElectricityCounter/${counterId}`).subscribe((counter: any) => owner.electricity = counter);
      this.http.get(`${environment.blockchainServer}/EVCoinWallet/${walletId}`).subscribe((wallet: any) => owner.wallet = wallet);
    });
  }

  addChargeStation(name: string, ownerId: string) {
    return this.http.post(`${environment.blockchainServer}/ChargeStation`, {
      stationId: randomId(),
      name,
      owner: `resource:org.valor.evnet.ChargeStationOwner#${ownerId}`
    });
  }

  deleteChargeStation(id: string) {
    return this.http.delete(`${environment.blockchainServer}/ChargeStation/${id}`);
  }

  getCharges() {
    return this.http.get(`${environment.blockchainServer}/ChargeStation`).pipe(
      switchMap((stations: any[]) => {
        const requests = stations.map(station => this.http.get(`${environment.blockchainServer}/ChargeStationOwner/${station.owner.split('#')[1]}`));

        return forkJoin(requests)
          .pipe(
            tap(owners => owners.forEach((owner, index) => stations[index].owner = owner)),
            map(() => stations)
          );
      })
    );
  }

  getChargeStationsByOwnerId(id: string) {
    const params = {
      owner: `resource:org.valor.evnet.ChargeStationOwner#${id}`
    };

    return this.http.get(`${environment.blockchainServer}/queries/selectChargeStationsByOwnerId`, {params});
  }

  updateCompany(id: string, data: any) {
    return this.http.put(`${environment.blockchainServer}/ChargeStationOwner/${id}`, data);
  }
}
