import {inputObjectType, objectType} from "nexus";

export const ListingReviewScores = objectType({
  name: 'ListingReviewScores',
  definition(t) {
    t.int('review_scores_accuracy')
    t.int('review_scores_checkin')
    t.int('review_scores_cleanliness')
    t.int('review_scores_communication')
    t.int('review_scores_location')
    t.int('review_scores_rating')
    t.int('review_scores_value')
  }
})

export const ListingReviewScoresInput = inputObjectType({
  name: 'ListingReviewScoresInput',
  definition(t) {
    t.int('review_scores_accuracy')
    t.int('review_scores_checkin')
    t.int('review_scores_cleanliness')
    t.int('review_scores_communication')
    t.int('review_scores_location')
    t.int('review_scores_rating')
    t.int('review_scores_value')
  }
})