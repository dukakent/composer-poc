import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class SuppliersService {
  allSuppliers$ = new BehaviorSubject([]);

  constructor(private readonly http: HttpClient) {}

  createSupplier(name: string): Observable<any> {
    return this.http.post(`${environment.blockchainServer}/CreateSupplier`, {name});
  }

  getSuppliers(): Observable<any> {
    return this.http.get(`${environment.blockchainServer}/ElectricitySupplier`);
  }

  getSupplier(id: string) {
    return this.http.get(`${environment.blockchainServer}/ElectricitySupplier/${id}`).pipe(
      switchMap((supplier: any) => {
        const counterId = supplier.electricity.split('#')[1];
        const walletId = supplier.wallet.split('#')[1];

        return forkJoin(
          this.http.get(`${environment.blockchainServer}/ElectricityCounter/${counterId}`),
          this.http.get(`${environment.blockchainServer}/EVCoinWallet/${walletId}`)
        ).pipe(
          map(([counter, wallet]: any) => {
            supplier.electricity = counter;
            supplier.wallet = wallet;

            return supplier;
          })
        );

      })
    );
  }

  refreshSuppliers() {
    this.http.get(`${environment.blockchainServer}/ElectricitySupplier`).pipe(
      tap(suppliers => this.allSuppliers$.next(suppliers as any)),
      switchMap(from as any)
    ).subscribe(supplier => {
      const counterId = supplier.electricity.split('#')[1];
      const walletId = supplier.wallet.split('#')[1];

      this.http.get(`${environment.blockchainServer}/ElectricityCounter/${counterId}`).subscribe((counter: any) => supplier.electricity = counter);
      this.http.get(`${environment.blockchainServer}/EVCoinWallet/${walletId}`).subscribe((wallet: any) => supplier.wallet = wallet);
    });
  }

  updateSupplier(id: string, data: any) {
    return this.http.put(`${environment.blockchainServer}/ElectricitySupplier/${id}`, data);
  }
}
