// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { UserSubscriptionPlan } from "@/types"
import { basicPlan, freePlan, hobbyPlan, legacyBasicPlan, proPlan } from "@/config/subscriptions"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export async function getUserSubscriptionPlan(
    userId: string
): Promise<UserSubscriptionPlan> {
    const user = await db.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
    })

    if (!user) {
        throw new Error("User not found")
    }

    const hasPlan = user.stripePriceId &&
        user.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now()

    let plan = freePlan
    if (hasPlan) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId)

        if (subscription.plan.nickname === "Pro plan") {
            plan = proPlan
        } else if (subscription.plan.nickname === "Hobby plan") {
            plan = hobbyPlan
        } else if (subscription.plan.nickname === "Basic plan") {
            // if subscription is created before 2024-05-01, it's a legacy plan
            console.log(subscription.created)
            if (subscription.created < 1717200000) {
                plan = legacyBasicPlan
            } else {
                plan = basicPlan
            }

        }
    }

    return {
        ...plan,
        ...user,
        stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime(),
    }
}

/**
 * Checks what features a user has access to based on their subscription plan
 * @param userId The ID of the user to check
 * @returns An object indicating which features are available
 */
export async function checkSubscriptionFeatures(userId: string): Promise<{
  allowCrawling: boolean;
  allowMultipleKnowledgeSources: boolean;
  allowCustomModels: boolean;
  maxFiles: number;
}> {
  try {
    const subscriptionPlan = await getUserSubscriptionPlan(userId);
    
    // Default feature set for free plan
    const features = {
      allowCrawling: false,
      allowMultipleKnowledgeSources: false,
      allowCustomModels: false,
      maxFiles: subscriptionPlan.maxFiles || 10
    };
    
    // Check plan name to determine features
    if (subscriptionPlan.name === 'Pro') {
      features.allowCrawling = true;
      features.allowMultipleKnowledgeSources = true;
      features.allowCustomModels = true;
    } else if (subscriptionPlan.name === 'Hobby' || subscriptionPlan.name === 'Basic') {
      features.allowCrawling = true;
      features.allowMultipleKnowledgeSources = true;
      features.allowCustomModels = false;
    }
    
    return features;
  } catch (error) {
    console.error(`Error checking subscription features for user ${userId}:`, error);
    
    // Return the most restrictive set of features if there's an error
    return {
      allowCrawling: false,
      allowMultipleKnowledgeSources: false,
      allowCustomModels: false,
      maxFiles: 10
    };
  }
}