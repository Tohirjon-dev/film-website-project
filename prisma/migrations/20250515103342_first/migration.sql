-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('user', 'admin', 'superadmin');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'expired', 'canceled', 'pending_payment');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('card', 'paypal', 'bank_transfer', 'crypto');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "MovieSubscriptionType" AS ENUM ('free', 'premium');

-- CreateEnum
CREATE TYPE "MovieFileQuality" AS ENUM ('p240', 'p360', 'p480', 'p720', 'p1080', 'K4');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "Roles" NOT NULL DEFAULT 'user',
    "avatar_url" VARCHAR(255),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptionplans" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "features" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "subscriptionplans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usersubscriptions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'pending_payment',
    "auto_renew" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usersubscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "user_subscription_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_details" JSONB NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "external_transaction_id" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "release_year" INTEGER NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "poster_url" VARCHAR(255),
    "rating" DECIMAL(3,1),
    "subscription_type" "MovieSubscriptionType" NOT NULL DEFAULT 'free',
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moviecategories" (
    "id" SERIAL NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "moviecategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moviefiles" (
    "id" SERIAL NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "file_url" VARCHAR(255) NOT NULL,
    "quality" "MovieFileQuality" NOT NULL,
    "language" VARCHAR(20) NOT NULL DEFAULT 'uz',

    CONSTRAINT "moviefiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watchhistory" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "watched_duration" INTEGER NOT NULL,
    "watched_percentage" DECIMAL(5,2) NOT NULL,
    "last_watched" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watchhistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "movies_slug_key" ON "movies"("slug");

-- AddForeignKey
ALTER TABLE "usersubscriptions" ADD CONSTRAINT "usersubscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usersubscriptions" ADD CONSTRAINT "usersubscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscriptionplans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_subscription_id_fkey" FOREIGN KEY ("user_subscription_id") REFERENCES "usersubscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moviecategories" ADD CONSTRAINT "moviecategories_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moviecategories" ADD CONSTRAINT "moviecategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moviefiles" ADD CONSTRAINT "moviefiles_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchhistory" ADD CONSTRAINT "watchhistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchhistory" ADD CONSTRAINT "watchhistory_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
