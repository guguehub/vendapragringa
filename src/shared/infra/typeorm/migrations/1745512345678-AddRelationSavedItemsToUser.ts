import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddRelationSavedItemsToUser1745512345678
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adiciona a coluna item_id à tabela existente
    await queryRunner.addColumn(
      'saved_items',
      new TableColumn({
        name: 'item_id',
        type: 'uuid',
        isNullable: true, // Temporariamente true para evitar falhas se já houver dados
      }),
    );

    // Cria foreign key para items
    await queryRunner.createForeignKey(
      'saved_items',
      new TableForeignKey({
        name: 'FK_SavedItems_Item',
        columnNames: ['item_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'items',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('saved_items', 'FK_SavedItems_Item');
    await queryRunner.dropColumn('saved_items', 'item_id');
  }
}
