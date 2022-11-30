import {inputObjectType, objectType} from "nexus";

export const ListingAddressLocation = objectType({
  name: 'ListingsAndReviewsAddressLocation',
  definition(t) {
    t.list.float('coordinates')
    t.boolean('is_location_exact')
    t.string('type')
  }
})

export const ListingAddressLocationInput = inputObjectType({
  name: 'ListingAddressLocationInput',
  definition(t) {
    t.list.float('coordinates')
    t.boolean('is_location_exact')
    t.string('type')
  }
})
