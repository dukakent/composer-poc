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
 * @param {org.valor.evnet.SetElectricityPrice} setElectricityPrice
 * @transaction
 */
async function setElectricityPrice(tx) {
  if (tx.newPrice <= 0) {
    throw new Error('Price can\'t be less than or equal to 0');
  }

  tx.seller.electricityPrice = tx.newPrice;

  const participantRegistry = await getParticipantRegistry(`${namespace}.ElectricitySeller`);
  await participantRegistry.update(tx.seller);
}

/**
 * Sample transaction
 * @param {org.valor.evnet.BuyElectricity} buyElectricity
 * @transaction
 */
async function buyElectricity(tx) {
  const registryEVCoinWallet = await getAssetRegistry(`${namespace}.EVCoinWallet`);
  const registryElectricityCounter = await getAssetRegistry(`${namespace}.ElectricityCounter`);

  const buyerBallance = tx.buyer.wallet.amount;
  const sellerElectricityAmount = tx.seller.electricity.amount;
  const totalPrice = tx.seller.electricitySellPrice * tx.amount;

  console.log('@debug tx.amount', tx.amount);

  if (sellerElectricityAmount < tx.amount) {
    throw new Error('Insufficient electricity from seller');
  }

  if (buyerBallance < totalPrice) {
    throw new Error('Insufficient money from buyer');
  }

  tx.buyer.wallet.amount = tx.buyer.wallet.amount - totalPrice;
  tx.seller.wallet.amount = tx.seller.wallet.amount + totalPrice;
  tx.buyer.electricity.amount = tx.buyer.electricity.amount + tx.amount;
  tx.seller.electricity.amount = tx.seller.electricity.amount - tx.amount;

  await registryEVCoinWallet.update(tx.buyer.wallet);
  await registryEVCoinWallet.update(tx.seller.wallet);
  await registryElectricityCounter.update(tx.buyer.electricity);
  await registryElectricityCounter.update(tx.seller.electricity);
}

/**
 * Sample transaction
 * @param {org.valor.evnet.ChargeCar} chargeCar
 * @transaction
 */
async function chargeCar(tx) {
  const registryElectricityCounter = await getParticipantRegistry(`${namespace}.ElectricityCounter`);

  if (tx.driver.electricity.amount < tx.amount) {
    throw new Error('Insufficient electricity');
  }

  tx.driver.electricity.amount = tx.driver.electricity.amount - tx.amount;

  await registryElectricityCounter.update(tx.driver.electricity.amount);
}

/**
 * Sample transaction
 * @param {org.valor.evnet.CreateDriver} createDriver
 * @transaction
 */
async function createDriver(tx) {
  const driverRegistry = await getParticipantRegistry(`${namespace}.Driver`);
  const electricityCounterRegistry = await getAssetRegistry(`${namespace}.ElectricityCounter`);
  const evCoinWalletRegistry = await getAssetRegistry(`${namespace}.EVCoinWallet`);
  const factory = getFactory();

  // create Driver instance
  const newIdDriver = uuid();
  const driver = factory.newResource(namespace, 'Driver', newIdDriver);
  driver.name = tx.name;
  driver.electricitySellPrice = 1;
  
  // create ElectricityCounter instance
  const electricityId = uuid();
  const electricity = factory.newResource(namespace, 'ElectricityCounter', electricityId);
  electricity.amount = 0;
  
  // create EVCoinWallet instance
  const walletId = uuid();
  const wallet = factory.newResource(namespace, 'EVCoinWallet', walletId);
  wallet.amount = 0;
  
  driver.electricity = factory.newRelationship(namespace, 'ElectricityCounter', electricityId);
  driver.wallet = factory.newRelationship(namespace, 'EVCoinWallet', walletId);

  await electricityCounterRegistry.add(electricity);
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
  const electricityCounterRegistry = await getAssetRegistry(`${namespace}.ElectricityCounter`);
  const evCoinWalletRegistry = await getAssetRegistry(`${namespace}.EVCoinWallet`);
  const factory = getFactory();

  // create StationOwner instance
  const newIdStationOwner = uuid();
  const stationOwner = factory.newResource(namespace, 'ChargeStationOwner', newIdStationOwner);
  stationOwner.name = tx.name;
  stationOwner.electricitySellPrice = 1;

  // create ElectricityCounter instance
  const newIdElectricityCounter = uuid();
  const electricity = factory.newResource(namespace, 'ElectricityCounter', newIdElectricityCounter);
  electricity.amount = 0;

  // create EVCoinWallet instance
  const newIdevCoinWallet = uuid();
  const wallet = factory.newResource(namespace, 'EVCoinWallet', newIdevCoinWallet);
  wallet.amount = 0;

  stationOwner.electricity = factory.newRelationship(namespace, 'ElectricityCounter', newIdElectricityCounter);
  stationOwner.wallet = factory.newRelationship(namespace, 'EVCoinWallet', newIdevCoinWallet);

  await electricityCounterRegistry.add(electricity);
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
  const electricityCounterRegistry = await getAssetRegistry(`${namespace}.ElectricityCounter`);
  const evCoinWalletRegistry = await getAssetRegistry(`${namespace}.EVCoinWallet`);
  const factory = getFactory();

  // create Supplier instance
  const newIdSupplier = uuid();
  const supplier = factory.newResource(namespace, 'ElectricitySupplier', newIdSupplier);
  supplier.name = tx.name;
  supplier.electricitySellPrice = 1;

  // create ElectricityCounter instance
  const newIdElectricityCounter = uuid();
  const electricity = factory.newResource(namespace, 'ElectricityCounter', newIdElectricityCounter);
  electricity.amount = 9999;

  // create EVCoinWallet instance
  const newIdevCoinWallet = uuid();
  const wallet = factory.newResource(namespace, 'EVCoinWallet', newIdevCoinWallet);
  wallet.amount = 0;

  supplier.electricity = factory.newRelationship(namespace, 'ElectricityCounter', newIdElectricityCounter);
  supplier.wallet = factory.newRelationship(namespace, 'EVCoinWallet', newIdevCoinWallet);

  await electricityCounterRegistry.add(electricity);
  await evCoinWalletRegistry.add(wallet);
  await supplierRegistry.add(supplier);
}

/**
 * @param {org.valor.evnet.ChargeCar} tx - transaction
 * @transaction
 */
async function chargeCar(tx) {
  const evCoinWalletRegistry = await getAssetRegistry(`${namespace}.EVCoinWallet`);
  const carRegistry = await getAssetRegistry(`${namespace}.Car`);

  const owner = tx.station.owner;
  const driver = tx.car.owner;
  const currentChargeLevel = tx.car.batteryCapacity * tx.car.chargeLeft;
  const goalChargeLevel = tx.car.batteryCapacity * tx.chargeGoal;
  const amountToCharge = goalChargeLevel - currentChargeLevel;
  const price = amountToCharge * owner.electricitySellPrice;

  if (tx.chargeGoal > 100) {
    throw new Error('charge goal must be a percentage value');
  }

  if (owner.electricity.amount < amountToCharge) {
    throw new Error('Insufficient electricity');
  }


  if (driver.wallet.amount < price) {
    throw new Error('Insufficient money');
  }

  driver.wallet.amount = driver.wallet.amount - price;
  owner.wallet.amount = owner.wallet.amount + price;
  tx.car.chargeLeft = tx.chargeGoal;

  await evCoinWalletRegistry.update(driver.wallet);
  await evCoinWalletRegistry.update(owner.wallet);
  await carRegistry.update(tx.car);
}


function uuid() {
  return (Math.random() * 100000).toFixed();
}
