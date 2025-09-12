import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProduct1698463000012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'quantity',
            type: 'int',
            default: 0,
          },
          {
            name: 'listingUrl',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'mercadoLivreItemId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'shippingPrice',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'condition',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'availableQuantity',
            type: 'int',
            default: 0,
          },
          {
            name: 'sellerId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'categoryId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'images',
            type: 'text',
            isNullable: false,
            comment: 'simple-array',
          },
          {
            name: 'currency',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'publishedAt',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'expirationDate',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'marketplace',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'itemType',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
