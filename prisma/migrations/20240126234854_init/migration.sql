-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CLICK', 'REJECT', 'SUCCESS');

-- CreateTable
CREATE TABLE "ShortURL" (
    "id" VARCHAR(12) NOT NULL,
    "longUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortURL_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "shortURLId" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_eventType_idx" ON "Event"("eventType");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_shortURLId_fkey" FOREIGN KEY ("shortURLId") REFERENCES "ShortURL"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
