"use client";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  daysUntilReorder?: number;
  orderAmount?: number;
  currentInventoryUnits: number;
  sellRate: number;
  leadTimeDays: number;
};

const defaultProducts = [
  {
    id: 1,
    name: "product 1",
    currentInventoryUnits: 0,
    sellRate: 0,
    leadTimeDays: 0,
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [minimumInventory, setMinimumInventory] = useState(45);
  const [maximumInventory, setMaximumInventory] = useState(120);

  const calculate = () => {
    const newProducts = [...products];
    for (let i = 0; i < products.length; i++) {
      const product = newProducts[i];
      const daysUntilReorder =
        product.currentInventoryUnits / product.sellRate -
        product.leadTimeDays -
        minimumInventory;

      product.daysUntilReorder = Math.floor(daysUntilReorder);

      const orderAmount =
        product.leadTimeDays / product.sellRate +
        minimumInventory * product.sellRate;
      product.orderAmount = orderAmount;
    }
    setProducts(newProducts);
  };

  return (
    <>
      <h1 style={{ fontSize: "24px" }}>Inventory Assistant</h1>
      <table style={{ border: "1px solid black", marginBottom: "30px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black" }}>product</th>
            <th style={{ border: "1px solid black" }}>days until reorder</th>
            <th style={{ border: "1px solid black" }}>order amount</th>
            <th style={{ border: "1px solid black" }}>
              sell rate(units per day)
            </th>
            <th style={{ border: "1px solid black" }}>
              current inventory level (in days)
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ border: "1px solid black" }}>{product.name}</td>
              <td style={{ border: "1px solid black" }}>
                {product.daysUntilReorder}
              </td>
              <td style={{ border: "1px solid black" }}>
                {product.orderAmount}
              </td>
              <td style={{ border: "1px solid black" }}>{product.sellRate}</td>

              <td style={{ border: "1px solid black" }}>
                {product.currentInventoryUnits}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ui for editing default products*/}
      <div style={{ fontSize: "24px" }}>Edit Product Inputs</div>
      {products.map((product, index) => {
        return (
          <div
            key={product.id}
            style={{
              marginBottom: "15px",
              border: "1px solid black",
              width: "400px",
            }}
          >
            <div style={{ fontWeight: "bold" }}>Edit item {index + 1}</div>
            <label>name: </label>
            <input
              style={{
                border: "1px solid black",
                marginRight: "10px",
                marginBottom: "5px",
              }}
              value={product.name}
              onChange={(event) => {
                const newProducts = [...products];
                newProducts[index].name = event.target.value;
                setProducts(newProducts);
              }}
            />
            <br />
            <label>current inventory units: </label>
            <input
              style={{
                border: "1px solid black",
                marginRight: "10px",
                marginBottom: "5px",
              }}
              type="number"
              value={product.currentInventoryUnits}
              onChange={(event) => {
                const newProducts = [...products];
                newProducts[index].currentInventoryUnits = Number(
                  event.target.value
                );
                setProducts(newProducts);
              }}
            />
            <br />
            <label>sell rate: </label>
            <input
              style={{
                border: "1px solid black",
                marginRight: "10px",
                marginBottom: "10px",
              }}
              type="number"
              value={product.sellRate}
              onChange={(event) => {
                const newProducts = [...products];
                newProducts[index].sellRate = Number(event.target.value);
                setProducts(newProducts);
              }}
            />
            <br />

            <label>lead time days: </label>
            <input
              style={{
                border: "1px solid black",
                marginRight: "10px",
                marginBottom: "10px",
              }}
              type="number"
              value={product.leadTimeDays}
              onChange={(event) => {
                const newProducts = [...products];
                newProducts[index].leadTimeDays = Number(event.target.value);
                setProducts(newProducts);
              }}
            />
          </div>
        );
      })}
      <div>
        <label>minimum inventory: </label>
        <input
          style={{ border: "1px solid black", marginRight: "10px" }}
          type="number"
          value={minimumInventory}
          onChange={(event) => {
            setMinimumInventory(Number(event.target.value));
          }}
        />
      </div>
      <div>
        <label>maximum inventory: </label>
        <input
          style={{ border: "1px solid black", marginRight: "10px" }}
          type="number"
          value={maximumInventory}
          onChange={(event) => {
            setMaximumInventory(Number(event.target.value));
          }}
        />
      </div>
      <div>
        <button
          type="button"
          onClick={calculate}
          style={{
            padding: "10px",
            backgroundColor: "gray",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          calculate
        </button>
      </div>
    </>
  );
}
