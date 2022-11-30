import {inputObjectType, objectType} from "nexus";

export const ListingAvailability = objectType({
  name: 'ListingsAndReviewsAvailability',
  definition(t) {
    t.int('availability_30')
    t.int('availability_365')
    t.int('availability_60')
    t.int('availability_90')
  }
})

export const ListingAvailabilityInput = inputObjectType({
  name: 'ListingAvailabilityInput',
  definition(t) {
    t.int('availability_30')
    t.int('availability_365')
    t.int('availability_60')
    t.int('availability_90')
  }
})