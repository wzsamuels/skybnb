import {inputObjectType, objectType} from "nexus";

export const ListingReviews = objectType({
  name: 'ListingReviews',
  definition(t) {
    t.nonNull.string('id')
    t.string('comments')
    t.datetime('date')
    t.nonNull.string('listing_id')
    t.nonNull.string('reviewer_id')
    t.string('reviewer_name')
  }
})

export const ListingReviewsInput = inputObjectType({
  name: 'ListingReviewsInput',
  definition(t) {
    t.string('id')
    t.string('comments')
    t.datetime('date')
    t.string('listing_id')
    t.string('reviewer_id')
    t.string('reviewer_name')
  }
})