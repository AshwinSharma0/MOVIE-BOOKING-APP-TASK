const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchRevenue() {
  const response = await fetch(`${BASE_URL}/admin/revenue`);
  if (!response.ok) {
    throw new Error('Unable to fetch revenue data');
  }
  return response.json();
}

export async function fetchBookingsReport() {
  const response = await fetch(`${BASE_URL}/admin/bookings`);
  if (!response.ok) {
    throw new Error('Unable to fetch bookings data');
  }
  return response.json();
}

export async function fetchPeakHours() {
  const response = await fetch(`${BASE_URL}/admin/peak-hours`);
  if (!response.ok) {
    throw new Error('Unable to fetch peak hours data');
  }
  return response.json();
}
