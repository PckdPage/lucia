-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('Work', 'Personal', 'Shopping');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('High', 'Medium', 'Low');

-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "category" "Categories" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "addedDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "priority" "Priority" NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
