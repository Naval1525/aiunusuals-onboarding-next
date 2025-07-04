// Hel.io Crypto Payment Configuration
export const helioConfig = {
  apiUrl:'https://api.hel.io/v1/subscriptions',
  paylinkId: process.env.HELIO_PAYLINK_ID!,
  apiKey: process.env.HELIO_API_KEY!,
  bearerToken: process.env.HELIO_BEARER_TOKEN!,
  paymentUrl: process.env.HELIO_PAYMENT_URL || 'https://app.hel.io/pay/68666cd56d172087f5d87c0d',
} 