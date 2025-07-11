import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSavedItemsNoEnum1748824371575 implements MigrationInterface {
    name = 'CreateSavedItemsNoEnum1748824371575';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "subscriptions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "status" character varying NOT NULL DEFAULT 'active',
                "tier" character varying NOT NULL DEFAULT 'free',
                "startDate" TIMESTAMP,
                "endDate" TIMESTAMP,
                "expiresAt" TIMESTAMP,
                "userId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_fbdba4e2ac694cf8c9cecf4dc84" UNIQUE ("userId"),
                CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_fbdba4e2ac694cf8c9cecf4dc8" ON "subscriptions" ("userId")`);

        await queryRunner.query(`
            CREATE TABLE "suppliers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "website" character varying,
                "description" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_5b5720d9645cee7396595a16c93" UNIQUE ("name"),
                CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "price" numeric(10,2) NOT NULL,
                "description" character varying,
                "external_id" character varying,
                "marketplace" character varying,
                "shipping_price" numeric(10,2),
                "status" character varying,
                "is_listed_on_ebay" boolean,
                "ebay_title" character varying,
                "ebay_offer_value_usd" numeric(10,2),
                "is_offer_enabled" boolean DEFAULT false,
                "is_campaign_enabled" boolean DEFAULT false,
                "ebay_shipping_weight_grams" integer,
                "ebay_category" character varying,
                "ml_link" character varying,
                "ebay_link" character varying,
                "notes" text,
                "last_scraped_at" TIMESTAMP,
                "tags" character varying,
                "images" text,
                "import_stage" character varying NOT NULL DEFAULT 'draft',
                "ebay_fee_percent" numeric(5,2) NOT NULL DEFAULT '13.25',
                "use_custom_fee_percent" boolean NOT NULL DEFAULT false,
                "custom_fee_percent" numeric(5,2),
                "ebay_fees_usd" numeric(10,2),
                "sale_value_usd" numeric(10,2),
                "exchange_rate" numeric(10,2),
                "received_brl" numeric(10,2),
                "item_profit_brl" numeric(10,2),
                "ml_shipping_cost_brl" numeric(10,2),
                "is_draft" boolean NOT NULL DEFAULT true,
                "is_synced" boolean NOT NULL DEFAULT false,
                "supplier_id" uuid,
                "user_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_created_id" uuid,
                "user_updated_id" uuid,
                CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "saved_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "item_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_178c333cea0ad47a6c7a3321349" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "products" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" character varying,
                "price" numeric(10,2) NOT NULL DEFAULT '0',
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "user_tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "token" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "shipping_types" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "code" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_53672a5dcdf0c6ea3f668123aaf" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "shipping_zone_countries" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "countryCode" character varying NOT NULL,
                "zone_id" uuid,
                CONSTRAINT "PK_866b306371214e69a52f6667b28" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "shipping_zones" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "code" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_e55857b9198ec611b75d72ff958" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "shipping_weights" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "min_kg" double precision NOT NULL,
                "max_kg" double precision NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_521aad4efc03a5822bc45204b95" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "shipping_prices" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "shipping_type_id" uuid NOT NULL,
                "shipping_zone_id" uuid NOT NULL,
                "shipping_weight_id" uuid NOT NULL,
                "price" numeric NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_27787e256cc747e197759f4445f" PRIMARY KEY ("id")
            )
        `);

        // FKs
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_1b00f62115285f72fd7b51db561" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id")`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_3b934e62fb52bac909e0ddf5422" FOREIGN KEY ("user_id") REFERENCES "users"("id")`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_2cd33a9e2dda8a8695e27bd1e2b" FOREIGN KEY ("user_created_id") REFERENCES "users"("id")`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_132c78ab909786d5d735ccb0482" FOREIGN KEY ("user_updated_id") REFERENCES "users"("id")`);
        await queryRunner.query(`ALTER TABLE "saved_items" ADD CONSTRAINT "FK_881a58b54d78fd46a7a1ea878b3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "saved_items" ADD CONSTRAINT "FK_2aa24b15abb68b00c0b040fa149" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "shipping_zone_countries" ADD CONSTRAINT "FK_4da465fa0ddc38461c221390f93" FOREIGN KEY ("zone_id") REFERENCES "shipping_zones"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "shipping_prices" ADD CONSTRAINT "FK_941af77fc45e48924126d481fcc" FOREIGN KEY ("shipping_type_id") REFERENCES "shipping_types"("id")`);
        await queryRunner.query(`ALTER TABLE "shipping_prices" ADD CONSTRAINT "FK_86121f3fb46974e98b8d12e9671" FOREIGN KEY ("shipping_zone_id") REFERENCES "shipping_zones"("id")`);
        await queryRunner.query(`ALTER TABLE "shipping_prices" ADD CONSTRAINT "FK_shipping_weight" FOREIGN KEY ("shipping_weight_id") REFERENCES "shipping_weights"("id")`);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping_prices" DROP CONSTRAINT "FK_86121f3fb46974e98b8d12e9671"`);
        await queryRunner.query(`ALTER TABLE "shipping_prices" DROP CONSTRAINT "FK_941af77fc45e48924126d481fcc"`);
        await queryRunner.query(`ALTER TABLE "shipping_zone_countries" DROP CONSTRAINT "FK_4da465fa0ddc38461c221390f93"`);
        await queryRunner.query(`ALTER TABLE "saved_items" DROP CONSTRAINT "FK_2aa24b15abb68b00c0b040fa149"`);
        await queryRunner.query(`ALTER TABLE "saved_items" DROP CONSTRAINT "FK_881a58b54d78fd46a7a1ea878b3"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_132c78ab909786d5d735ccb0482"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_2cd33a9e2dda8a8695e27bd1e2b"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_3b934e62fb52bac909e0ddf5422"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_1b00f62115285f72fd7b51db561"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84"`);

        await queryRunner.query(`DROP TABLE "shipping_prices"`);
        await queryRunner.query(`DROP TABLE "shipping_weights"`);
        await queryRunner.query(`DROP TABLE "shipping_zones"`);
        await queryRunner.query(`DROP TABLE "shipping_zone_countries"`);
        await queryRunner.query(`DROP TABLE "shipping_types"`);
        await queryRunner.query(`DROP TYPE "public"."shipping_types_code_enum"`);
        await queryRunner.query(`DROP TABLE "user_tokens"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "saved_items"`);
        await queryRunner.query(`DROP TABLE "items"`);
        await queryRunner.query(`DROP TABLE "suppliers"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fbdba4e2ac694cf8c9cecf4dc8"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
    }
}
