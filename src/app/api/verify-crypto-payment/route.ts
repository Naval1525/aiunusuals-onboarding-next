import { NextRequest, NextResponse } from 'next/server'
import { helioConfig } from '@/lib/helio-config'

// TypeScript interfaces for Hel.io API response
interface CustomerDetails {
  email: string
  discordUser: string | null
  telegramUser: string | null
}

interface TokenQuote {
  from: string
  fromAmountDecimal: string
  to: string
  toAmountMinimal: string
}

interface TransactionMeta {
  id: string
  amount: string
  senderPK: string
  recipientPK: string
  transactionType: string
  customerDetails: CustomerDetails
  productDetails: any | null
  additionalProductDetails: any[]
  transactionSignature: string
  transactionStatus: 'SUCCESS' | 'PENDING' | 'FAILED'
  splitRevenue: boolean
  remainingAccounts: any[]
  totalAmount: string
  totalAmountAsUSD: string
  affiliateAmount: string
  tokenQuote: TokenQuote
  shopifyPaymentDetails: any | null
  submitGeolocation: string
}

interface Transaction {
  id: string
  paylinkId: string
  fee: string
  quantity: number
  createdAt: string
  paymentType: 'PAYLINK' | string
  meta: TransactionMeta
}

interface Subscription {
  id: string
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  email: string
  renewalDate: string
  createdAt: string
  transactions: Transaction[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    console.log('Verifying crypto payment for email:', email)

    // Construct the Hel.io API URL with parameters
    const url = `${helioConfig.apiUrl}?paylink=${helioConfig.paylinkId}&apiKey=${helioConfig.apiKey}`
    
    console.log('Fetching from Hel.io API:', url)
    console.log('Paylink ID:', helioConfig.paylinkId)
    console.log('API Key:', helioConfig.apiKey ? 'Present' : 'Missing')
    console.log('Bearer Token:', helioConfig.bearerToken ? 'Present' : 'Missing')
    
    // Make the request to Hel.io API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${helioConfig.bearerToken}`
      }
    })

    console.log("THIS IS THE RESPONSE ------------>", response);
    console.log("Response status:", response.status);
    console.log("Response statusText:", response.statusText);

    if (!response.ok) {
      console.error('Hel.io API response not ok:', response.status, response.statusText)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch payment data from Hel.io' },
        { status: 500 }
      )
    }

    const subscriptions: Subscription[] = await response.json()
    console.log('Received subscriptions from Hel.io:', subscriptions.length)
    
    // Check if the provided email exists in any of the successful transactions
    const emailFound = subscriptions.some((subscription: Subscription) => {
      const emailMatch = subscription.email === email
      const isActive = subscription.status === 'ACTIVE'
      const hasSuccessfulTransaction = subscription.transactions.some((transaction: Transaction) => 
        transaction.meta.transactionStatus === 'SUCCESS'
      )
      
      console.log(`Subscription check for ${email}:`, {
        emailMatch,
        isActive,
        hasSuccessfulTransaction,
        subscriptionEmail: subscription.email,
        subscriptionStatus: subscription.status,
        transactionCount: subscription.transactions.length
      })
      
      return emailMatch && isActive && hasSuccessfulTransaction
    })

    console.log('Email found in successful transactions:', emailFound)

    if (emailFound) {
      return NextResponse.json({
        success: true,
        verified: true,
        message: 'Payment verified successfully'
      })
    } else {
      return NextResponse.json({
        success: true,
        verified: false,
        message: 'No successful payment found for this email'
      })
    }

  } catch (error) {
    console.error('Error verifying crypto payment:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 