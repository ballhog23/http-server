ALTER TABLE "refresh_tokens" ALTER COLUMN "token" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "refresh_tokens" ALTER COLUMN "expires_at" DROP DEFAULT;