import type { Seat } from '../types/movie';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchSeats(movieId: string | number): Promise<Seat[]> {
  const response = await fetch(`${BASE_URL}/seats/${movieId}`);
  if (!response.ok) {
    throw new Error('Unable to fetch seats from the backend');
  }

  const data = await response.json();
  return (data.seats || []).map((seat: any) => ({
    ...seat,
    seatNumber: seat.seat_number,
    lockedUntil: seat.locked_until,
    isBooked: seat.is_booked
  }));
}

export async function lockSeat(movieId: string | number, seatId: number): Promise<{ lock_token: string }> {
  const response = await fetch(`${BASE_URL}/seats/lock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ movie_id: movieId, seat_id: seatId })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Unable to lock seat');
  }

  return { lock_token: data.seat.lock_token };
}

export async function releaseSeatLock(movieId: string | number, seatId: number, lockToken?: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/seats/release`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ movie_id: movieId, seat_id: seatId, lock_token: lockToken })
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Unable to release seat lock');
  }
}

export async function createBooking(payload: {
  movie_id: string | number;
  seat_ids: number[];
  user_name: string;
  user_email: string;
  lock_tokens: Record<string, string>;
}): Promise<any> {
  const response = await fetch(`${BASE_URL}/book`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.message || 'Unable to create booking');
}

return data;
}
