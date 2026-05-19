import { eq } from "drizzle-orm";
import { db } from "#server/utils/auth";
import * as schema from "#server/db/schema/auth-schema";

export default defineEventHandler(() => {
  return db
    .select({
      id: schema.driver.id,
      firstName: schema.driver.firstName,
      lastName: schema.driver.lastName,
      number: schema.driver.number,
      active: schema.driver.active,
      teamId: schema.driver.teamId,
      teamName: schema.team.name,
      teamColor: schema.team.color,
    })
    .from(schema.driver)
    .innerJoin(schema.team, eq(schema.driver.teamId, schema.team.id))
    .orderBy(schema.team.name, schema.driver.lastName);
});
