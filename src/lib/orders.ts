import { supabase } from "./supabase";

export interface Order {
  id: number;
  created_at: string;
  product_id: number;
  units: number;
  expected_arrival_date: string;
}

export type NewOrder = Omit<Order, "id" | "created_at">;

export async function createOrder(order: NewOrder) {
  const { data, error } = await supabase
    .from("Order")
    .insert([order])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrder(id: number, updates: Partial<NewOrder>) {
  const { data, error } = await supabase
    .from("Order")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteOrder(id: number) {
  const { error } = await supabase.from("Order").delete().eq("id", id);

  if (error) throw error;
}

export async function fetchOrders(productId: number) {
  const { data, error } = await supabase
    .from("Order")
    .select(
      `
      *,
      product:Product(*)
    `
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
