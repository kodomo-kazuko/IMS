-- AlterEnum
ALTER TYPE "InternshipStatus" ADD VALUE 'CANCELLED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InternshipType" ADD VALUE 'VOLUNTEER';
ALTER TYPE "InternshipType" ADD VALUE 'PART_TIME';

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Mentor" ADD COLUMN     "image" TEXT;
