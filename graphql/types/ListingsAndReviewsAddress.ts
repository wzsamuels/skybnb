import {inputObjectType, objectType} from "nexus";
import {
  ListingAddressLocation,
  ListingAddressLocationInput
} from "./ListingsAndReviewsAddressLocation";

export const ListingAddress = objectType({
  name: 'ListingAddress',
  definition(t) {
    t.string('country')
    t.string('country_code')
    t.string('government_area')
    t.field('location', {type: ListingAddressLocation})
    t.string('market')
    t.string('street')
    t.string('suburb')
  }
})

export const ListingAddressInput = inputObjectType({
  name: 'ListingAddressInput',
  definition(t) {
    t.string('country')
    t.string('country_code')
    t.string('government_area')
    t.field('location', {type: ListingAddressLocationInput})
    t.string('market')
    t.string('street')
    t.string('suburb')
  }
})