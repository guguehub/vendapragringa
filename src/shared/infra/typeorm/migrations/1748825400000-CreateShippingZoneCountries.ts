import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateShippingZoneCountries1748825400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shipping_zone_countries',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'countryCode',
            type: 'varchar',
          },
          {
            name: 'zone_id',
            type: 'uuid',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'shipping_zone_countries',
      new TableForeignKey({
        columnNames: ['zone_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'shipping_zones',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('shipping_zone_countries');
  }
}
