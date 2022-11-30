import {inputObjectType, objectType} from "nexus";

export const ListingImages = objectType({
  name: 'ListingsAndReviewsImages',
  definition(t) {
    t.nonNull.string('medium_url')
    t.nonNull.string('picture_url')
    t.nonNull.string('thumbnail_url')
    t.nonNull.string('xl_picture_url')
  }
})

export const ListingImagesInput = inputObjectType({
  name: 'ListingImagesInput',
  definition(t) {
    t.nonNull.string('medium_url')
    t.nonNull.string('picture_url')
    t.nonNull.string('thumbnail_url')
    t.nonNull.string('xl_picture_url')
  }
})