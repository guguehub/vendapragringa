import { IsUUID } from 'class-validator';

export class CreateSavedItemDTO {
  @IsUUID()
  item_id: string;
}
