export const QuotaInitialValues = {
  free: {
    scrape_balance: 10,
  },
  bronze: {
    scrape_balance: 30,
  },
  silver: {
    scrape_balance: 70,
  },
  gold: {
    scrape_balance: 100,
  },
  infinity: {
    scrape_balance: Number.MAX_SAFE_INTEGER, // ilimitado
  },
} as const;
