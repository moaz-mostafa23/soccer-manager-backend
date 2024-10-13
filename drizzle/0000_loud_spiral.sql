CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"is_verified" boolean DEFAULT false,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
