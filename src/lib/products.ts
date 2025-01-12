import { supabase } from "./supabase";

export interface Product {
  id: number;
  created_at: string;
  name: string;
  safety_stock_days: number;
  production_lead_time_days: number;
  shipping_lead_time: number;
  max_stock_days: number;
  current_stock_units: number;
}

export type NewProduct = Omit<Product, "id" | "created_at">;

export async function createProduct(product: NewProduct) {
  const { data, error } = await supabase
    .from("Product")
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: number, updates: Partial<NewProduct>) {
  const { data, error } = await supabase
    .from("Product")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: number) {
  const { error } = await supabase.from("Product").delete().eq("id", id);

  if (error) throw error;
}

export async function fetchProducts() {
  const { data, error } = await supabase.from("Product").select("*");

  if (error) throw error;
  return data;
}
