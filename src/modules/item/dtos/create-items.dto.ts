import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  title: string; // alinhado com a entidade

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number; // obrigatório conforme entidade (não opcional)

  @IsString()
  @IsOptional()
  externalId?: string;

  @IsString()
  @IsOptional()
  marketplace?: string; // ex: mercadolivre, olx, shopee

  @IsString()
  @IsOptional()
  condition?: string;

  @IsNumber()
  @IsOptional()
  soldCount?: number;

  @IsNumber()
  @IsOptional()
  shippingPrice?: number;

  @IsString()
  @IsOptional()
  status?: string; // ready | listed | sold

  @IsString()
  @IsOptional()
  itemLink?: string;

  @IsString()
  @IsOptional()
  images?: string; // JSON string com URLs das imagens

  @IsString()
  @IsOptional()
  importStage?: string; // draft, ready, listed etc.

  @IsOptional()
  isDraft?: boolean;

  @IsOptional()
  isSynced?: boolean;

  @IsString()
  @IsOptional()
  createdBy?: string;
}
