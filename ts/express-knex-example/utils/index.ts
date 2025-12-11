import z from 'zod';

export function checkUuid(v: string): void {
  z.string().uuid().parse(v);
}
