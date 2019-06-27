import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { randomId } from '../helpers/random-id.helper';

@Injectable({providedIn: 'root'})
export class DriversService {
  allDrivers$ = new BehaviorSubject([]);

  constructor(private readonly http: HttpClient) {}

  createDriver(name: string): Observable<any> {
    return this.http.post(`${environment.blockchainServer}/CreateDriver`, {name});
  }

  getDriver(id: string) {
    return this.http.get(`${environment.blockchainServer}/Driver/${id}`).pipe(
      switchMap((driver: any) => {
        const counterId = driver.electricity.split('#')[1];
        const walletId = driver.wallet.split('#')[1];

        return forkJoin(
          this.http.get(`${environment.blockchainServer}/ElectricityCounter/${counterId}`),
          this.http.get(`${environment.blockchainServer}/EVCoinWallet/${walletId}`)
        ).pipe(
          map(([counter, wallet]: any) => {
            driver.electricity = counter;
            driver.wallet = wallet;

            return driver;
          })
        );

      })
    );
  }

  refreshDrivers() {
    this.http.get(`${environment.blockchainServer}/Driver`).pipe(
      tap(drivers => this.allDrivers$.next(drivers as any)),
      switchMap(from as any)
    ).subscribe(driver => {
      const counterId = driver.electricity.split('#')[1];
      const walletId = driver.wallet.split('#')[1];

      this.http.get(`${environment.blockchainServer}/ElectricityCounter/${counterId}`).subscribe((counter: any) => driver.electricity = counter);
      this.http.get(`${environment.blockchainServer}/EVCoinWallet/${walletId}`).subscribe((wallet: any) => driver.wallet = wallet);
    });
  }

  addCar(name: string, ownerId: string) {
    return this.http.post(`${environment.blockchainServer}/Car`, {
      carId: randomId(),
      name,
      owner: `resource:org.valor.evnet.Driver#${ownerId}`
    });
  }

  deleteCar(carId: string) {
    return this.http.delete(`${environment.blockchainServer}/Car/${carId}`);
  }

  getCarsByOwnerId(id: string) {
    const params = {
      owner: `resource:org.valor.evnet.Driver#${id}`
    };

    return this.http.get(`${environment.blockchainServer}/queries/selectCarsByOwnerId`, {params});
  }
}
