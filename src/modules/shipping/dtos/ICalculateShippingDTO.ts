interface ICalculateShippingDTO {
  shippingType: 'document' | 'product';
  countryCode: string; // exemplo: 'US'
  weightGrams: number;
}
