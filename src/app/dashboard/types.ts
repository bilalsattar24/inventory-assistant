export interface InventoryParams {
  safetyStockDays: number;
  productionLeadTime: number;
  shippingLeadTime: number;
  maxStockDays: number;
  currentFBAStock: number;
}

export interface WeeklyForecast {
  date: Date;
  incomingShipments: number;
  amazonInventory: number;
  forecastedDailySales: number;
  daysOfStock: number;
}

export interface OrderShipment {
  orderDate: Date;
  orderQuantity: number;
  shipDate: Date;
  shipQuantity: number;
  requiredArrivalDate: Date;
  lowStockAlert: string | null;
}
