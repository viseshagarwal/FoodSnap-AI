
-- Update all users to be verified
UPDATE "User" SET "emailVerified" = true;

-- Drop the constraint first
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_verificationToken_key";

-- Drop verification token fields
ALTER TABLE "User" DROP COLUMN IF EXISTS "verificationToken";
ALTER TABLE "User" DROP COLUMN IF EXISTS "verificationTokenExpiry";

