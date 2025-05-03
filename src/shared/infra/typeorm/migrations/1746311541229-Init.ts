import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1746311541229 implements MigrationInterface {
    name = 'Init1746311541229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "suppliers" DROP CONSTRAINT "FK_8b6a94866e7d6ac179bbb67a1f8"
        `);
        await queryRunner.query(`
            ALTER TABLE "items" DROP CONSTRAINT "FK_acc043f0f22a28b521fe43a28b0"
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items" DROP CONSTRAINT "SavedItemUser"
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items" DROP CONSTRAINT "FK_SavedItems_Item"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_tokens" DROP CONSTRAINT "TokenUser"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_SUBSCRIPTIONS_USERID"
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers" DROP COLUMN "marketplace"
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers" DROP COLUMN "external_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers" DROP COLUMN "email"
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers" DROP COLUMN "link"
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers" DROP COLUMN "address"
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers" DROP COLUMN "city"
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers" DROP COLUMN "state"
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers" DROP COLUMN "country"
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers" DROP COLUMN "zip_code"
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers" DROP COLUMN "is_active"
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers" DROP COLUMN "userId"
        `);
        await queryRunner.query(`
            ALTER TABLE "items" DROP COLUMN "supplierId"
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items" DROP COLUMN "title"
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items" DROP COLUMN "price"
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items" DROP COLUMN "link"
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items" DROP COLUMN "image_url"
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_tokens" DROP COLUMN "user_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_tokens" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_tokens" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers"
            ADD "description" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "items"
            ADD "supplier_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "items"
            ADD "user_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "items"
            ADD "user_created_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "items"
            ADD "user_updated_id" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "user_tokens"
            ADD "userId" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_tokens"
            ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "user_tokens"
            ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers"
            ADD CONSTRAINT "UQ_5b5720d9645cee7396595a16c93" UNIQUE ("name")
        `);
        await queryRunner.query(`
            ALTER TABLE "items" DROP COLUMN "description"
        `);
        await queryRunner.query(`
            ALTER TABLE "items"
            ADD "description" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items"
            ALTER COLUMN "item_id"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_fbdba4e2ac694cf8c9cecf4dc8" ON "subscriptions" ("userId")
        `);
        await queryRunner.query(`
            ALTER TABLE "items"
            ADD CONSTRAINT "FK_1b00f62115285f72fd7b51db561" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "items"
            ADD CONSTRAINT "FK_2cd33a9e2dda8a8695e27bd1e2b" FOREIGN KEY ("user_created_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "items"
            ADD CONSTRAINT "FK_3b934e62fb52bac909e0ddf5422" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items"
            ADD CONSTRAINT "FK_881a58b54d78fd46a7a1ea878b3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items"
            ADD CONSTRAINT "FK_2aa24b15abb68b00c0b040fa149" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "saved_items" DROP CONSTRAINT "FK_2aa24b15abb68b00c0b040fa149"
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items" DROP CONSTRAINT "FK_881a58b54d78fd46a7a1ea878b3"
        `);
        await queryRunner.query(`
            ALTER TABLE "items" DROP CONSTRAINT "FK_3b934e62fb52bac909e0ddf5422"
        `);
        await queryRunner.query(`
            ALTER TABLE "items" DROP CONSTRAINT "FK_2cd33a9e2dda8a8695e27bd1e2b"
        `);
        await queryRunner.query(`
            ALTER TABLE "items" DROP CONSTRAINT "FK_1b00f62115285f72fd7b51db561"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_fbdba4e2ac694cf8c9cecf4dc8"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items"
            ALTER COLUMN "item_id" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "items" DROP COLUMN "description"
        `);
        await queryRunner.query(`
            ALTER TABLE "items"
            ADD "description" text
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers" DROP CONSTRAINT "UQ_5b5720d9645cee7396595a16c93"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_tokens" DROP COLUMN "updatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_tokens" DROP COLUMN "createdAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_tokens" DROP COLUMN "userId"
        `);
        await queryRunner.query(`
            ALTER TABLE "items" DROP COLUMN "user_updated_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "items" DROP COLUMN "user_created_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "items" DROP COLUMN "user_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "items" DROP COLUMN "supplier_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers" DROP COLUMN "description"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_tokens"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "user_tokens"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "user_tokens"
            ADD "user_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items"
            ADD "image_url" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items"
            ADD "link" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items"
            ADD "price" numeric(10, 2) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items"
            ADD "title" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "items"
            ADD "supplierId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers"
            ADD "userId" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers"
            ADD "is_active" boolean NOT NULL DEFAULT true
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers"
            ADD "zip_code" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers"
            ADD "country" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers"
            ADD "state" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers"
            ADD "city" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers"
            ADD "address" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers"
            ADD "link" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers"
            ADD "email" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers"
            ADD "external_id" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers"
            ADD "marketplace" character varying
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_SUBSCRIPTIONS_USERID" ON "subscriptions" ("userId")
        `);
        await queryRunner.query(`
            ALTER TABLE "user_tokens"
            ADD CONSTRAINT "TokenUser" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items"
            ADD CONSTRAINT "FK_SavedItems_Item" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "saved_items"
            ADD CONSTRAINT "SavedItemUser" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "items"
            ADD CONSTRAINT "FK_acc043f0f22a28b521fe43a28b0" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "suppliers"
            ADD CONSTRAINT "FK_8b6a94866e7d6ac179bbb67a1f8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
