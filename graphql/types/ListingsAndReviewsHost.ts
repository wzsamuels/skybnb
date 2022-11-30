import {inputObjectType, objectType} from "nexus";

export const ListingHost = objectType({
  name: 'ListingHost',
  definition(t) {
    t.string('host_about')
    t.boolean('host_has_profile_pic')
    t.string('host_id')
    t.boolean('host_identity_verified')
    t.boolean('host_is_superhost')
    t.int('host_listings_count')
    t.string('host_location')
    t.string('host_name')
    t.string('host_neighbourhood')
    t.string('host_picture_url')
    t.int('host_response_rate')
    t.string('host_response_time')
    t.string('host_thumbnail_url')
    t.int('host_total_listings_count')
    t.string('host_url')
    t.list.string('host_verifications')
  }
})

export const ListingHostInput = inputObjectType({
  name: 'ListingHostInput',
  definition(t) {
    t.string('host_about')
    t.boolean('host_has_profile_pic')
    t.string('host_id')
    t.boolean('host_identity_verified')
    t.boolean('host_is_superhost')
    t.int('host_listings_count')
    t.string('host_location')
    t.string('host_name')
    t.string('host_neighbourhood')
    t.string('host_picture_url')
    t.int('host_response_rate')
    t.string('host_response_time')
    t.string('host_thumbnail_url')
    t.int('host_total_listings_count')
    t.string('host_url')
    t.list.string('host_verifications')
  }
})