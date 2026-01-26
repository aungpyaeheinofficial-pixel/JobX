import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Get subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: { monthly: 0, yearly: 0 },
        features: [
          '5 job applications/month',
          'Basic profile',
          'Community access',
          'Job alerts'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        price: { monthly: 9.99, yearly: 99 },
        features: [
          'Unlimited applications',
          'Featured profile badge',
          'Priority in search results',
          'Advanced analytics',
          'No ads',
          'Resume builder',
          'Direct messaging'
        ]
      },
      {
        id: 'business',
        name: 'Business',
        price: { monthly: 49.99, yearly: 499 },
        features: [
          'Everything in Pro',
          '10 job postings/month',
          'Applicant tracking system',
          'Team collaboration',
          'API access',
          'Dedicated support',
          'Custom branding'
        ]
      }
    ];

    res.json({ plans });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Get current subscription
router.get('/current', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        subscription_plan,
        subscription_status,
        subscription_start_date,
        subscription_end_date
      FROM users WHERE id = $1`,
      [req.user.id]
    );

    const subscription = await query(
      `SELECT * FROM subscriptions 
       WHERE user_id = $1 AND status = 'active'
       ORDER BY created_at DESC LIMIT 1`,
      [req.user.id]
    );

    res.json({
      plan: result.rows[0].subscription_plan,
      status: result.rows[0].subscription_status,
      startDate: result.rows[0].subscription_start_date,
      endDate: result.rows[0].subscription_end_date,
      subscription: subscription.rows[0] || null
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Create subscription checkout session
router.post('/checkout', authenticate, [
  body('plan').isIn(['pro', 'business']).withMessage('Invalid plan'),
  body('billing_cycle').isIn(['monthly', 'yearly']).withMessage('Invalid billing cycle'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { plan, billing_cycle } = req.body;

    const planPrices = {
      pro: { monthly: 999, yearly: 9900 }, // in cents
      business: { monthly: 4999, yearly: 49900 }
    };

    const priceId = planPrices[plan][billing_cycle];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: req.user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `JobX ${plan.charAt(0).toUpperCase() + plan.slice(1)} - ${billing_cycle}`,
            },
            unit_amount: priceId,
            recurring: billing_cycle === 'monthly' ? { interval: 'month' } : { interval: 'year' },
          },
          quantity: 1,
        },
      ],
      mode: billing_cycle === 'monthly' ? 'subscription' : 'payment',
      success_url: `${process.env.FRONTEND_URL}/payments?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/premium?canceled=true`,
      metadata: {
        userId: req.user.id,
        plan,
        billing_cycle,
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Webhook handler for Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleCheckoutCompleted(session);
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await handleSubscriptionUpdate(subscription);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handlePaymentSucceeded(invoice);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

async function handleCheckoutCompleted(session) {
  const { userId, plan, billing_cycle } = session.metadata;

  const startDate = new Date();
  const endDate = new Date();
  if (billing_cycle === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  // Update user subscription
  await query(
    `UPDATE users 
     SET subscription_plan = $1,
         subscription_status = 'active',
         subscription_start_date = $2,
         subscription_end_date = $3,
         stripe_customer_id = $4
     WHERE id = $5`,
    [plan, startDate, endDate, session.customer, userId]
  );

  // Create subscription record
  await query(
    `INSERT INTO subscriptions (
      user_id, plan, billing_cycle, status, amount, currency,
      stripe_subscription_id, stripe_customer_id,
      current_period_start, current_period_end
    ) VALUES ($1, $2, $3, 'active', $4, 'USD', $5, $6, $7, $8)`,
    [
      userId,
      plan,
      billing_cycle,
      billing_cycle === 'monthly' ? 9.99 : 99,
      session.subscription || null,
      session.customer,
      startDate,
      endDate
    ]
  );

  // Create transaction record
  await query(
    `INSERT INTO transactions (
      user_id, type, amount, currency, description, category, status, related_type
    ) VALUES ($1, 'outgoing', $2, 'USD', $3, 'subscription', 'completed', 'subscription')`,
    [
      userId,
      billing_cycle === 'monthly' ? 9.99 : 99,
      `JobX ${plan} subscription - ${billing_cycle}`
    ]
  );
}

async function handleSubscriptionUpdate(subscription) {
  const status = subscription.status === 'active' ? 'active' : 'cancelled';

  await query(
    `UPDATE subscriptions 
     SET status = $1, updated_at = NOW()
     WHERE stripe_subscription_id = $2`,
    [status, subscription.id]
  );

  if (status === 'cancelled') {
    await query(
      `UPDATE users 
       SET subscription_status = 'cancelled'
       WHERE stripe_customer_id = $1`,
      [subscription.customer]
    );
  }
}

async function handlePaymentSucceeded(invoice) {
  // Handle recurring payment
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    await handleSubscriptionUpdate(subscription);
  }
}

// Cancel subscription
router.post('/cancel', authenticate, async (req, res) => {
  try {
    const subscription = await query(
      `SELECT stripe_subscription_id FROM subscriptions 
       WHERE user_id = $1 AND status = 'active'
       ORDER BY created_at DESC LIMIT 1`,
      [req.user.id]
    );

    if (subscription.rows.length === 0) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    await stripe.subscriptions.update(subscription.rows[0].stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    await query(
      `UPDATE subscriptions 
       SET cancel_at_period_end = true, updated_at = NOW()
       WHERE stripe_subscription_id = $1`,
      [subscription.rows[0].stripe_subscription_id]
    );

    res.json({ message: 'Subscription will be cancelled at the end of the billing period' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

export default router;
