import z from 'zod';

export function checkUuid(v: string): void {
  z.string().uuid().parse(v);
}

export const getNowUTC = () => new Date().toISOString();
