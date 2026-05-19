import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

// dont know what this autUser table is for
const authUser = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const team = pgTable("team", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  color: text("color").notNull().default("#666666"),
});

export const driver = pgTable(
  "driver",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    number: integer("number").notNull().unique(),
    teamId: text("teamId")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    active: boolean("active").notNull().default(true),
  },
  (table) => [index("driver_teamId_idx").on(table.teamId)],
);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const race = pgTable(
  "race",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    location: text("location").notNull(),
    startAt: timestamp("startAt", { withTimezone: true }).notNull(),
    season: integer("season").notNull(),
  },
  (table) => [
    index("race_season_idx").on(table.season),
    unique("race_name_season_unique").on(table.name, table.season),
  ],
);

export const league = pgTable(
  "league",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    image: text("image"),
    inviteCode: text("inviteCode").notNull().unique(),
    season: integer("season").notNull().default(new Date().getFullYear()),
    scoringConfig: jsonb("scoringConfig").$type<{
      exact: number;
      offBy1: number;
      offBy2: number;
      offBy3Plus: number;
      notInTop10: number;
      lockMinutesBefore: number;
      openDaysBefore: number;
    } | null>(),
    pitwallEnabled: boolean("pitwallEnabled").notNull().default(false),
    createdBy: text("createdBy")
      .notNull()
      .references(() => authUser.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("league_createdBy_idx").on(table.createdBy),
    index("league_season_idx").on(table.season),
  ],
);

export const leagueMember = pgTable(
  "leagueMember",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    leagueId: text("leagueId")
      .notNull()
      .references(() => league.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => authUser.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("member"),
    joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  },
  (table) => [
    unique("leagueMember_leagueId_userId_unique").on(
      table.leagueId,
      table.userId,
    ),
    index("leagueMember_leagueId_idx").on(table.leagueId),
    index("leagueMember_userId_idx").on(table.userId),
  ],
);

export const prediction = pgTable(
  "prediction",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => authUser.id, { onDelete: "cascade" }),
    raceId: text("raceId")
      .notNull()
      .references(() => race.id, { onDelete: "cascade" }),
    leagueId: text("leagueId")
      .notNull()
      .references(() => league.id, { onDelete: "cascade" }),
    positions: jsonb("positions").notNull().$type<string[]>(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("prediction_userId_raceId_leagueId_unique").on(
      table.userId,
      table.raceId,
      table.leagueId,
    ),
    index("prediction_raceId_idx").on(table.raceId),
    index("prediction_userId_idx").on(table.userId),
    index("prediction_leagueId_idx").on(table.leagueId),
  ],
);

export const raceResult = pgTable("raceResult", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  raceId: text("raceId")
    .notNull()
    .references(() => race.id, { onDelete: "cascade" })
    .unique(),
  positions: jsonb("positions").notNull().$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userPreferences = pgTable("userPreferences", {
  userId: text("userId")
    .primaryKey()
    .references(() => authUser.id, { onDelete: "cascade" }),
  notificationsEnabled: boolean("notificationsEnabled").notNull().default(true),
});

export const teamRelations = relations(team, ({ many }) => ({
  drivers: many(driver),
}));

export const driverRelations = relations(driver, ({ one }) => ({
  team: one(team, { fields: [driver.teamId], references: [team.id] }),
}));

export const raceRelations = relations(race, ({ many, one }) => ({
  predictions: many(prediction),
  result: one(raceResult, {
    fields: [race.id],
    references: [raceResult.raceId],
  }),
}));

export const leagueRelations = relations(league, ({ many, one }) => ({
  members: many(leagueMember),
  predictions: many(prediction),
  creator: one(authUser, {
    fields: [league.createdBy],
    references: [authUser.id],
  }),
}));

export const leagueMemberRelations = relations(leagueMember, ({ one }) => ({
  league: one(league, {
    fields: [leagueMember.leagueId],
    references: [league.id],
  }),
  user: one(authUser, {
    fields: [leagueMember.userId],
    references: [authUser.id],
  }),
}));

export const predictionRelations = relations(prediction, ({ one }) => ({
  user: one(authUser, {
    fields: [prediction.userId],
    references: [authUser.id],
  }),
  race: one(race, { fields: [prediction.raceId], references: [race.id] }),
  league: one(league, {
    fields: [prediction.leagueId],
    references: [league.id],
  }),
}));

export const raceResultRelations = relations(raceResult, ({ one }) => ({
  race: one(race, { fields: [raceResult.raceId], references: [race.id] }),
}));

export const schema = {
  verification,
  account,
  session,
  user,
  race,
  league,
  leagueMember,
  raceResult,
  prediction,
};
