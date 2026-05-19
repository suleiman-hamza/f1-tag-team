import { eq } from "drizzle-orm";
import { db } from "#server/utils/auth";
import * as schema from "#server/db/schema/auth-schema";

export default defineEventHandler(async (event) => {
  const log = useLogger(event);
  const { user } = await requireUserSession(event);
  log.set({ user: { id: user.id } });

  const [pref] = await db
    .select()
    .from(schema.userPreferences)
    .where(eq(schema.userPreferences.userId, user.id))
    .limit(1);

  return { notificationsEnabled: pref?.notificationsEnabled ?? true };
});
