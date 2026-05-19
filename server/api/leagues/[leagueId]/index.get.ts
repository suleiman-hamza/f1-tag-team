import { eq } from "drizzle-orm";
import { db } from "#server/utils/auth";
import * as schema from "#server/db/schema/auth-schema";

export default defineEventHandler(async (event) => {
  const leagueId = getRouterParam(event, "leagueId")!;
  const { membership } = await requireLeagueMember(event, leagueId);

  const [league] = await db
    .select()
    .from(schema.league)
    .where(eq(schema.league.id, leagueId))
    .limit(1);

  if (!league) {
    throw createError({ statusCode: 404, message: "League not found" });
  }

  const members = await db
    .select()
    .from(schema.leagueMember)
    .where(eq(schema.leagueMember.leagueId, leagueId));

  return {
    ...league,
    inviteCode: league.inviteCode,
    memberCount: members.length,
    currentUserRole: membership.role,
  };
});
