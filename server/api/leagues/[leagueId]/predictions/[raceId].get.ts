import { and, eq } from "drizzle-orm";
import { db } from "#server/utils/auth";
import * as schema from "#server/db/schema/auth-schema";

export default defineEventHandler(async (event) => {
  const leagueId = getRouterParam(event, "leagueId")!;
  const raceId = getRouterParam(event, "raceId")!;
  const { user } = await requireLeagueMember(event, leagueId);

  const [prediction] = await db
    .select()
    .from(schema.prediction)
    .where(
      and(
        eq(schema.prediction.userId, user.id),
        eq(schema.prediction.raceId, raceId),
        eq(schema.prediction.leagueId, leagueId),
      ),
    )
    .limit(1);

  return prediction ?? null;
});
