import { SubscriptionPlan } from "@/types"

export const freePlan: SubscriptionPlan = {
    name: "FREE",
    description: "The FREE plan is limited to 1 chatbot, 1 crawler, 3 files and 500 messages per month.",
    stripePriceId: "",

    maxChatbots: 10,
    maxCrawlers: 10,
    maxFiles: 30,
    unlimitedMessages: false,
    maxMessagesPerMonth: 5000,
    basicCustomization: true,
    userInquiries: true,

    brandingCustomization: true,

    chatFileAttachments: true,

    price: 0,
}

export const hobbyPlan: SubscriptionPlan = {
    name: "HOBBY",
    description: "The HOBBY plan is limited 3 chatbot, 3 crawler and 9 files and unlimited messages.",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_HOBBY_PRICE_ID || "",

    maxChatbots: 3,
    maxCrawlers: 3,
    maxFiles: 9,
    unlimitedMessages: true,
    maxMessagesPerMonth: undefined,
    basicCustomization: true,
    userInquiries: false,

    brandingCustomization: true,
    chatFileAttachments: false,

    price: 3,
}

export const basicPlan: SubscriptionPlan = {
    name: "BASIC",
    description: "The BASIC plan has 9 chatbots, 9 crawlers and 27 files and unlimited messages.",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || "",

    maxChatbots: 9,
    maxCrawlers: 9,
    maxFiles: 27,
    unlimitedMessages: true,
    maxMessagesPerMonth: undefined,
    basicCustomization: true,
    userInquiries: true,

    chatFileAttachments: false,
    brandingCustomization: false,
    premiumSupport: true,

    price: 9,
}

export const legacyBasicPlan: SubscriptionPlan = {
    name: "BASIC",
    description: "The BASIC plan has 9 chatbots, 9 crawlers and 27 files and unlimited messages.",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || "",

    maxChatbots: 9,
    maxCrawlers: 9,
    maxFiles: 27,
    unlimitedMessages: true,
    maxMessagesPerMonth: undefined,
    basicCustomization: true,
    userInquiries: true,

    chatFileAttachments: false,
    brandingCustomization: true,
    premiumSupport: true,

    price: 9,
}

export const proPlan: SubscriptionPlan = {
    name: "PRO",
    description: "The PRO plan has 27 chatbots, 27 crawlers and 81 files and unlimited messages.",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",

    maxChatbots: 27,
    maxCrawlers: 27,
    maxFiles: 81,
    unlimitedMessages: true,
    maxMessagesPerMonth: undefined,
    basicCustomization: true,
    userInquiries: true,

    premiumSupport: true,
    chatFileAttachments: true,
    brandingCustomization: true,

    price: 27,
}