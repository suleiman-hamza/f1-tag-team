import { eq } from "drizzle-orm";
import { db } from "#server/utils/auth";
import * as schema from "#server/db/schema/auth-schema";

export default defineEventHandler(async (event) => {
  const leagueId = getRouterParam(event, "leagueId")!;
  await requireLeagueAdmin(event, leagueId);

  const newCode = generateInviteCode();

  const [updated] = await db
    .update(schema.league)
    .set({ inviteCode: newCode })
    .where(eq(schema.league.id, leagueId))
    .returning();

  return { inviteCode: updated!.inviteCode };
});
