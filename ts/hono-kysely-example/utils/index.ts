import z from "zod";

/** Check if uuid string is valid. */
export function checkUuid(v: string): void {
	z.string().uuid().parse(v);
}
