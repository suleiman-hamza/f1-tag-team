import { eq } from "drizzle-orm";
import { db } from "#server/utils/auth";
import * as schema from "#server/db/schema/auth-schema";

export default defineEventHandler(async (event) => {
  const log = useLogger(event);
  const leagueId = getRouterParam(event, "leagueId")!;
  const { user } = await requireLeagueAdmin(event, leagueId);
  log.set({
    user: { id: user.id },
    action: "delete-league",
    league: { id: leagueId },
  });

  await db.delete(schema.league).where(eq(schema.league.id, leagueId));

  return { success: true };
});
