-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "vat_applied" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "vat_rate" DOUBLE PRECISION NOT NULL DEFAULT 20.00,
    "payment_terms" INTEGER NOT NULL DEFAULT 30,
    "currency" TEXT NOT NULL DEFAULT '€',

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_user_id_key" ON "UserSettings"("user_id");

-- CreateIndex
CREATE INDEX "user_settings_user_id_index" ON "UserSettings"("user_id");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
