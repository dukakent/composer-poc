/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";
/**
 * Write your transction processor functions here
 */

const namespace = 'org.valor.evnet';

/**
 * Sample transaction
 * @param {org.valor.evnet.CreateDriver} createDriver
 * @transaction
 */
async function createDriver(tx) {
  const driverRegistry = await getParticipantRegistry(`${namespace}.Driver`);
  const evCoinWalletRegistry = await getAssetRegistry(`${namespace}.EVCoinWallet`);
  const factory = getFactory();

  // create Driver instance
  const newIdDriver = uuid();
  const driver = factory.newResource(namespace, 'Driver', newIdDriver);
  driver.name = tx.name;
  
  // create EVCoinWallet instance
  const walletId = uuid();
  const wallet = factory.newResource(namespace, 'EVCoinWallet', walletId);
  wallet.amount = 0;
  
  driver.wallet = factory.newRelationship(namespace, 'EVCoinWallet', walletId);

  await evCoinWalletRegistry.add(wallet);
  await driverRegistry.add(driver);
}

/**
 * CreateStationOwner
 * @param {org.valor.evnet.CreateChargeStationOwner} tx - transaction
 * @transaction
 */
async function createStationOwner(tx) {
  const stationOwnerRegistry = await getParticipantRegistry(`${namespace}.ChargeStationOwner`);
  const evCoinWalletRegistry = await getAssetRegistry(`${namespace}.EVCoinWallet`);
  const factory = getFactory();

  // create StationOwner instance
  const newIdStationOwner = uuid();
  const stationOwner = factory.newResource(namespace, 'ChargeStationOwner', newIdStationOwner);
  stationOwner.name = tx.name;

  // create EVCoinWallet instance
  const newIdevCoinWallet = uuid();
  const wallet = factory.newResource(namespace, 'EVCoinWallet', newIdevCoinWallet);
  wallet.amount = 0;

  stationOwner.wallet = factory.newRelationship(namespace, 'EVCoinWallet', newIdevCoinWallet);

  await evCoinWalletRegistry.add(wallet);
  await stationOwnerRegistry.add(stationOwner);
}

/**
 * CreateSupplier
 * @param {org.valor.evnet.CreateSupplier} tx - transaction
 * @transaction
 */
async function createSupplier(tx) {
  const supplierRegistry = await getParticipantRegistry(`${namespace}.ElectricitySupplier`);
  const evCoinWalletRegistry = await getAssetRegistry(`${namespace}.EVCoinWallet`);
  const factory = getFactory();

  // create Supplier instance
  const newIdSupplier = uuid();
  const supplier = factory.newResource(namespace, 'ElectricitySupplier', newIdSupplier);
  supplier.name = tx.name;

  // create EVCoinWallet instance
  const newIdevCoinWallet = uuid();
  const wallet = factory.newResource(namespace, 'EVCoinWallet', newIdevCoinWallet);
  wallet.amount = 0;

  supplier.wallet = factory.newRelationship(namespace, 'EVCoinWallet', newIdevCoinWallet);

  await evCoinWalletRegistry.add(wallet);
  await supplierRegistry.add(supplier);
}

function uuid() {
  return (Math.random() * 100000).toFixed();
}
