-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_debts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "delete_at" DATETIME,
    CONSTRAINT "debts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_debts" ("created_at", "delete_at", "description", "id", "updated_at", "userId", "value") SELECT "created_at", "delete_at", "description", "id", "updated_at", "userId", "value" FROM "debts";
DROP TABLE "debts";
ALTER TABLE "new_debts" RENAME TO "debts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
