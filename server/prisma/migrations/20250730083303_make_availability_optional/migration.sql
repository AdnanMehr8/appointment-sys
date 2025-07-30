/*
  Warnings:

  - A unique constraint covering the columns `[availabilityId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "availabilityId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_availabilityId_key" ON "public"."Appointment"("availabilityId");

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "public"."Availability"("id") ON DELETE SET NULL ON UPDATE CASCADE;
