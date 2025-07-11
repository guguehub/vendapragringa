import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateShippingPrices1748195300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shipping_prices',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'shipping_type_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'shipping_zone_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'shipping_weight_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'shipping_prices',
      new TableForeignKey({
        columnNames: ['shipping_type_id'],
        referencedTableName: 'shipping_types',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'shipping_prices',
      new TableForeignKey({
        columnNames: ['shipping_zone_id'],
        referencedTableName: 'shipping_zones',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'shipping_prices',
      new TableForeignKey({
        columnNames: ['shipping_weight_id'],
        referencedTableName: 'shipping_weights',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Primeiro remover as foreign keys
    const table = await queryRunner.getTable('shipping_prices');
    if (table) {
      const foreignKeys = table.foreignKeys.filter(fk =>
        ['shipping_type_id', 'shipping_zone_id', 'shipping_weight_id'].includes(fk.columnNames[0])
      );
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('shipping_prices', fk);
      }
    }

    // Depois remover a tabela
    await queryRunner.dropTable('shipping_prices');
  }
}
