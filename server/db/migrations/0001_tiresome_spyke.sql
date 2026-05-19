CREATE TABLE "driver" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"number" integer NOT NULL,
	"teamId" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "driver_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "league" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"image" text,
	"inviteCode" text NOT NULL,
	"season" integer DEFAULT 2026 NOT NULL,
	"scoringConfig" jsonb,
	"pitwallEnabled" boolean DEFAULT false NOT NULL,
	"createdBy" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "league_slug_unique" UNIQUE("slug"),
	CONSTRAINT "league_inviteCode_unique" UNIQUE("inviteCode")
);
--> statement-breakpoint
CREATE TABLE "leagueMember" (
	"id" text PRIMARY KEY NOT NULL,
	"leagueId" text NOT NULL,
	"userId" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"joinedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "leagueMember_leagueId_userId_unique" UNIQUE("leagueId","userId")
);
--> statement-breakpoint
CREATE TABLE "prediction" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"raceId" text NOT NULL,
	"leagueId" text NOT NULL,
	"positions" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "prediction_userId_raceId_leagueId_unique" UNIQUE("userId","raceId","leagueId")
);
--> statement-breakpoint
CREATE TABLE "race" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"startAt" timestamp with time zone NOT NULL,
	"season" integer NOT NULL,
	CONSTRAINT "race_name_season_unique" UNIQUE("name","season")
);
--> statement-breakpoint
CREATE TABLE "raceResult" (
	"id" text PRIMARY KEY NOT NULL,
	"raceId" text NOT NULL,
	"positions" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "raceResult_raceId_unique" UNIQUE("raceId")
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text DEFAULT '#666666' NOT NULL,
	CONSTRAINT "team_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "userPreferences" (
	"userId" text PRIMARY KEY NOT NULL,
	"notificationsEnabled" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "driver" ADD CONSTRAINT "driver_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "league" ADD CONSTRAINT "league_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leagueMember" ADD CONSTRAINT "leagueMember_leagueId_league_id_fk" FOREIGN KEY ("leagueId") REFERENCES "public"."league"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leagueMember" ADD CONSTRAINT "leagueMember_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prediction" ADD CONSTRAINT "prediction_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prediction" ADD CONSTRAINT "prediction_raceId_race_id_fk" FOREIGN KEY ("raceId") REFERENCES "public"."race"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prediction" ADD CONSTRAINT "prediction_leagueId_league_id_fk" FOREIGN KEY ("leagueId") REFERENCES "public"."league"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raceResult" ADD CONSTRAINT "raceResult_raceId_race_id_fk" FOREIGN KEY ("raceId") REFERENCES "public"."race"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userPreferences" ADD CONSTRAINT "userPreferences_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "driver_teamId_idx" ON "driver" USING btree ("teamId");--> statement-breakpoint
CREATE INDEX "league_createdBy_idx" ON "league" USING btree ("createdBy");--> statement-breakpoint
CREATE INDEX "league_season_idx" ON "league" USING btree ("season");--> statement-breakpoint
CREATE INDEX "leagueMember_leagueId_idx" ON "leagueMember" USING btree ("leagueId");--> statement-breakpoint
CREATE INDEX "leagueMember_userId_idx" ON "leagueMember" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "prediction_raceId_idx" ON "prediction" USING btree ("raceId");--> statement-breakpoint
CREATE INDEX "prediction_userId_idx" ON "prediction" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "prediction_leagueId_idx" ON "prediction" USING btree ("leagueId");--> statement-breakpoint
CREATE INDEX "race_season_idx" ON "race" USING btree ("season");