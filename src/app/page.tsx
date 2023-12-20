"use client";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  nextOrderDate?: Date;
  orderAmount?: number;
  currentInventoryLevel: number;
  sellRate: number;
  leadTimeDays: number;
};

const defaultProducts = [
  {
    id: 1,
    name: "product 1",
    currentInventoryLevel: 1,
    sellRate: 10,
    leadTimeDays: 70,
  },
  {
    id: 2,
    name: "product 2",
    currentInventoryLevel: 2,
    sellRate: 2,
    leadTimeDays: 70,
  },
  {
    id: 3,
    name: "product 3",
    currentInventoryLevel: 3,
    sellRate: 3,
    leadTimeDays: 70,
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [minimumInventory, setMinimumInventory] = useState(45);

  const calculate = () => {};

  return (
    <>
      <h1 style={{ fontSize: "24px" }}>Inventory Assistant</h1>
      <table style={{ border: "1px solid black", marginBottom: "30px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black" }}>product</th>
            <th style={{ border: "1px solid black" }}>next order date</th>
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
                {product.nextOrderDate?.toLocaleDateString()}
              </td>
              <td style={{ border: "1px solid black" }}>
                {product.orderAmount}
              </td>
              <td style={{ border: "1px solid black" }}>{product.sellRate}</td>

              <td style={{ border: "1px solid black" }}>
                {product.currentInventoryLevel}
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
            <label>current inventory level: </label>
            <input
              style={{
                border: "1px solid black",
                marginRight: "10px",
                marginBottom: "5px",
              }}
              type="number"
              value={product.currentInventoryLevel}
              onChange={(event) => {
                const newProducts = [...products];
                newProducts[index].currentInventoryLevel = Number(
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
