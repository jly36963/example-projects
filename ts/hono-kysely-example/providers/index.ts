import { getPgDal } from "./pg/index.js";
import type { Providers } from "../types/index.js";

export function getProviders({ pgUrl }: { pgUrl: string }): Providers {
	return {
		pgDal: getPgDal(pgUrl),
	};
}
