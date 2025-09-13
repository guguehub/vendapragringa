import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nome ou título comercial do produto (plano/serviço)
  @Column()
  product_title: string;

  // Descrição opcional do produto
  @Column({ nullable: true })
  description: string;

  // Preço do produto/plano
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  // Flag para ativar/desativar um produto
  @Column({ default: true })
  is_active: boolean;

  // Opcional: URL de referência (página de detalhe do plano)
  @Column({ nullable: true })
  product_url: string;

  // Imagem ilustrativa (pode ser usado no front para exibir cards de planos)
  @Column({ nullable: true })
  image_url: string;

  // Método de pagamento associado (ex: stripe, mercadopago, paypal)
  // pode ser null inicialmente (até termos implementação)
  @Column({ nullable: true })
  payment_method: string;

  // Categoria do produto (ex: plano, funcionalidade extra, módulo futuro)
  @Column({ nullable: true })
  category: string;

  // Tags como "Ouro, Prata, Bronze, Infinity"
  @Column('simple-array', { nullable: true })
  tags: string[];

  // Data de início/publicação do plano
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  published_at: Date;

  // Data de expiração (para promoções, testes temporários)
  @Column({ type: 'timestamp', nullable: true })
  expiration_date: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

export default Product;
