// src/__tests__/subscriptions/subscription-tier-validation.test.ts
import { SubscriptionTier } from '@modules/subscriptions/enums/subscription-tier.enum';

function testEnumValidation(tierInput: string) {
  console.log('--------------------------------------');
  console.log('Input tier:', tierInput);

  const normalizedTier = tierInput.trim().toLowerCase();
  console.log('Normalized tier:', normalizedTier);

  console.log('Enum values:', Object.values(SubscriptionTier));

  if (!Object.values(SubscriptionTier).includes(normalizedTier as SubscriptionTier)) {
    console.error(`❌ Invalid tier: ${tierInput}`);
  } else {
    console.log(`✅ Valid tier: ${tierInput}`);
  }
}

// Testando exemplos
testEnumValidation(' bronze ');
testEnumValidation('gold');
testEnumValidation('invalid');
