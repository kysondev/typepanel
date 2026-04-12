import { DB } from "generated/kysely/types";
import { Insertable, Selectable } from "kysely";

export type User = Selectable<DB["user"]>;
export type NewUser = Insertable<DB["user"]>;
export type UpdateUser = Insertable<DB["user"]>;
