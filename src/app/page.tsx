"use client";
import { useState } from "react";

type Product = {
  name: string;
  nextOrderDate?: Date;
  currentInventoryLevel: number;
  sellRate: number;
  leadTimeDays: number;
};

const defaultProducts = [
  {
    name: "product 1",
    currentInventoryLevel: 1,
    sellRate: 10,
    leadTimeDays: 70,
  },
  {
    name: "product 2",
    currentInventoryLevel: 2,
    sellRate: 2,
    leadTimeDays: 70,
  },
  {
    name: "product 3",
    currentInventoryLevel: 3,
    sellRate: 3,
    leadTimeDays: 70,
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);

  return (
    <>
      <h1>Inventory Assistant</h1>
      <table style={{ border: "1px solid black" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black" }}>product</th>
            <th style={{ border: "1px solid black" }}>next order date</th>
            <th style={{ border: "1px solid black" }}>sell rate</th>
            <th style={{ border: "1px solid black" }}>
              current inventory level
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.name}>
              <td style={{ border: "1px solid black" }}>{product.name}</td>
              <td style={{ border: "1px solid black" }}>
                {product.nextOrderDate?.toLocaleDateString()}
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
      <h2>edit default products</h2>
      {products.map((product, index) => {
        return (
          <div key={product.name}>
            <label>name: </label>
            <input
              style={{ border: "1px solid black", marginRight: "10px" }}
              type="number"
              value={product.name}
              onChange={(event) => {
                const newProducts = [...products];
                newProducts[index].name = event.target.value;
                setProducts(newProducts);
              }}
            />
            <label>current inventory level: </label>
            <input
              style={{ border: "1px solid black", marginRight: "10px" }}
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
            <label>sell rate: </label>
            <input
              style={{ border: "1px solid black", marginRight: "10px" }}
              type="number"
              value={product.sellRate}
              onChange={(event) => {
                const newProducts = [...products];
                newProducts[index].sellRate = Number(event.target.value);
                setProducts(newProducts);
              }}
            />
            <label>lead time days: </label>
            <input
              style={{ border: "1px solid black", marginRight: "10px" }}
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
        console.log(product);
      })}
    </>
  );
}
