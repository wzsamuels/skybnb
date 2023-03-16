import {extendType, inputObjectType, intArg, list, nonNull, objectType, queryField, stringArg} from "nexus";
import {ListingAddress, ListingAddressInput} from "./ListingsAndReviewsAddress";
import {ListingAvailability, ListingAvailabilityInput} from "./ListingsAndReviewsAvailability";
import {ListingHost, ListingHostInput} from "./ListingsAndReviewsHost";
import {ListingImages, ListingImagesInput} from "./ListingsAndReviewsImages";
import {ListingReviewScores, ListingReviewScoresInput} from "./ListingsAndReviewsReviewScores";
import {ListingReviews, ListingReviewsInput} from "./ListingsAndReviewsReviews";

export const Listing = objectType({
  name: 'Listing',
  definition(t) {
    t.nonNull.string('id')
    t.string('access')
    t.int('accommodates')
    t.string('house_rules')
    t.field('address', {type: ListingAddress})
    t.list.string('amenities')
    t.field('availability', {type: ListingAvailability})
    t.float('bathrooms')
    t.string('bed_type')
    t.int('bedrooms')
    t.int('beds')
    t.datetime('calendar_last_scraped')
    t.nonNull.string('cancellation_policy')
    t.float('cleaning_fee')
    t.nonNull.string('description')
    t.nonNull.float('extra_people')
    t.datetime('first_review')
    t.nonNull.float('guests_included')
    t.field('host', {type: ListingHost})
    t.string('house_rules')
    t.field('images', {type: ListingImages})
    t.string('interaction')
    t.datetime('last_review')
    t.datetime('last_scraped')
    t.string('listing_url')
    t.string('maximum_nights')
    t.string('minimum_nights')
    t.float('monthly_price')
    t.string('name')
    t.string('neighborhood_overview')
    t.string('notes')
    t.int('number_of_reviews')
    t.float('price')
    t.string('property_type')
    t.field('review_scores', {type: ListingReviewScores})
    t.list.field('reviews', {type: ListingReviews})
    t.int('reviews_per_month')
    t.string('room_type')
    t.float('security_deposit')
    t.string('space')
    t.string('summary')
    t.string('transit')
    t.float('weekly_price')
  }
})

/** Listing Input Type for queries. All fields are optional. **/
export const ListingInput = inputObjectType({
  name: 'ListingInput',
  definition(t) {
    t.string('id')
    t.string('access')
    t.int('accommodates')
    t.string('house_rules')
    t.field('address', {type: ListingAddressInput})
    t.list.string('amenities')
    t.field('availability', {type: ListingAvailabilityInput})
    t.float('bathrooms')
    t.string('bed_type')
    t.int('bedrooms')
    t.int('beds')
    t.datetime('calendar_last_scraped')
    t.string('cancellation_policy')
    t.float('cleaning_fee')
    t.string('description')
    t.float('extra_people')
    t.datetime('first_review')
    t.float('guests_included')
    t.field('host', {type: ListingHostInput})
    t.string('house_rules')
    t.field('images', {type: ListingImagesInput})
    t.string('interaction')
    t.datetime('last_review')
    t.datetime('last_scraped')
    t.string('listing_url')
    t.string('maximum_nights')
    t.string('minimum_nights')
    t.float('monthly_price')
    t.string('name')
    t.string('neighborhood_overview')
    t.string('notes')
    t.int('number_of_reviews')
    t.float('price')
    t.string('property_type')
    t.field('review_scores', {type: ListingReviewScoresInput})
    t.list.field('reviews', {type: ListingReviewsInput})
    t.int('reviews_per_month')
    t.string('room_type')
    t.float('security_deposit')
    t.string('space')
    t.string('summary')
    t.string('transit')
    t.float('weekly_price')
  }
})

export const ListingQuery = queryField('listing', {
  type: 'Listing',
  args: { query: nonNull(ListingInput)},
  resolve(_parent, args, ctx) {
    let queryOptions = {
        where : {
          ...(args.query?.id && { id: args.query.id}),
          ...(args.query?.address && {
            address: { is: {
                ...(args.query.address.country && {country: args.query.address.country})}}})
        }
      }

    return ctx.prisma.listingsAndReviews.findUnique({
      ...queryOptions
    })
  }
})

export const ListingsByIdQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('listingsById', {
      type: 'Response',
      args: {
        first: intArg(),
        after: stringArg(),
        ids: nonNull((list('String')))
      },
      async resolve(_, args, ctx) {
        let queryResults = null;
        const takeCount = args.first ? args.first : 50;

        const queryOptions = {
          take: takeCount,
          where: {
            id: { in: args.ids },
          }
        }

        if(args.after) {
          queryResults = await ctx.prisma.listingsAndReviews.findMany({
            skip: 1,
            cursor: {
              id: args.after,
            },
            ...queryOptions
          })
        } else {
          queryResults = await ctx.prisma.listingsAndReviews.findMany({
            ...queryOptions
          })
        }
        if(queryResults.length > 0) {
          const lastInResults = queryResults[queryResults.length - 1];
          const cursor = lastInResults.id
          const secondResults = await ctx.prisma.listingsAndReviews.findMany({
            cursor: {
              id: cursor
            },
            ...queryOptions
          })
          return {
            pageInfo: {
              endCursor: cursor,
              hasNextPage: secondResults.length >= takeCount
            },
            edges: queryResults.map(listing => ({
              cursor: listing.id,
              node: listing
            }))
          }
        }
        return {
          pageInfo: {
            endCursor: null,
            hasNextPage: false
          },
          edges: []
        }
      }
    })
  }
})

export const ListingsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('listings', {
      type: 'Response',
      args: {
        first: intArg(),
        after: stringArg(),
        query: ListingInput,
        minPrice: intArg(),
        maxPrice: intArg()
      },
      async resolve(_, args, ctx) {
        let queryResults = null;
        let queryOptions = {};
        const takeCount = args.first ? args.first : 50;

        if(args.query) {
          queryOptions = {
            take: takeCount,
            where : {
              price: {
                lte: 100
              },
              ...(args.query.id && { id: args.query.id}),
              ...(args.query.address && {
                address: {
                  is: {
                    ...(args.query.address.country && {country: args.query.address.country}),
                    ...(args.query.address.street && {street: args.query.address.street}),
                  }
                }
              }),
              ...((args.minPrice || args.maxPrice) && {
                price:
                  {
                    ...(args.maxPrice && { lte: (args.maxPrice === 1200 ? 50000 : args.maxPrice) }),
                    ...(args.minPrice && { gte: args.minPrice }),
                  }
              }),
              ...(args.query?.property_type && { property_type: args.query.property_type}),
            }
          };
        }
        else {
          queryOptions = {
            take: args.first ? args.first : 50,
            where: {
              ...((args.minPrice || args.maxPrice) && {
                price:
                  {
                    ...(args.maxPrice && { lte: (args.maxPrice === 1200 ? 50000 : args.maxPrice) }),
                    ...(args.minPrice && { gte: args.minPrice}),
                  }
              }),
            }
          };
        }

        if(args.after) {
          queryResults = await ctx.prisma.listingsAndReviews.findMany({
            skip: 1,
            cursor: {
              id: args.after,
            },
            ...queryOptions
          })
        } else {
          queryResults = await ctx.prisma.listingsAndReviews.findMany({
            ...queryOptions
          })
        }
        if(queryResults.length > 0) {
          const lastInResults = queryResults[queryResults.length - 1];
          const cursor = lastInResults.id
          const secondResults = await ctx.prisma.listingsAndReviews.findMany({
            cursor: {
              id: cursor
            },
            ...queryOptions
          })
          return {
            pageInfo: {
              endCursor: cursor,
              hasNextPage: secondResults.length >= takeCount
            },
            edges: queryResults.map(listing => ({
              cursor: listing.id,
              node: listing
            }))
          }
        }
        return {
          pageInfo: {
            endCursor: null,
            hasNextPage: false
          },
          edges: []
        }
      }
    })
  }
})

/*
export const ListingsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('listings', {
      type: 'Listing',
      args: { query: ListingInput, limit: "Int"},
      resolve(_parent, args, ctx) {
        if(!args.query) {
          return ctx.prisma.listingsAndReviews.findMany({
            take: args.limit ? args.limit : 100
          });
        }
        return ctx.prisma.listingsAndReviews.findMany({
          where: {
            OR: [
              {
                id: args.query?.id
              },
              {
                access: args.query?.access
              },
              {
                accommodates: args.query?.accommodates
              },
              {
                address: {
                  is:
                    {
                      country: args.query.address?.country,
                      suburb: args.query.address?.suburb
                    }
                }
              },
              {
                amenities: args.query?.amenities
              },
              {
                images: {
                  is:
                    {
                      medium_url: args.query.images?.medium_url
                    }
                }
              }
            ]
          },
          take: args.limit ? args.limit : 100
        })
      },
    })
  }
})
 */

export const Edge = objectType({
  name: 'Edge',
  definition(t) {
    t.string('cursor')
    t.field('node', {
      type: Listing,
    })
  },
})

export const PageInfo = objectType({
  name: 'PageInfo',
  definition(t) {
    t.string('endCursor')
    t.boolean('hasNextPage')
  },
})

export const Response = objectType({
  name: 'Response',
  definition(t) {
    t.field('pageInfo', { type: PageInfo })
    t.list.field('edges', {
      type: Edge,
    })
  },
})