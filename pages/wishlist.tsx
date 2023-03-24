import {useList} from "../context/ListContext";
import NavBar from "../components/NavBar";
import {gql, useQuery} from "@apollo/client";
import Image from 'next/image'
import {useEffect} from "react";
import Link from "next/link";

const GetListings = gql`
  query GetListing($first: Int, $after: String, $ids: [String]!) {
    listingsById(first: $first, after: $after, ids: $ids) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          name
          summary
          price
          images {
            picture_url
          }
          address {
            street
            country
          }
          review_scores {
            review_scores_rating
          }
          property_type
        }
      }
    }
  }
`

const Wishlist = () => {
  const {state, dispatch} = useList();
  const {data, loading, error, fetchMore} = useQuery(GetListings, {
    variables: {first: 20, ids: state.list}
  })

  useEffect(() => {
    console.log("Data", data);
    console.log("State", state.list)
  }, [data, state])

  if(loading) {
    return (
      <div>
        Loading
      </div>
    )
  }

  return (
    <div>
      <NavBar/>
      <div className={'flex flex-wrap justify-center'}>
        { data && state.list.length > 0 ? data?.listingsById.edges.map(listing =>
          <Link href={`/rooms/${listing.node.id}`} key={listing.node.id}>
            <div className={'m-4 w-[500px]'}>
              <Image className={'rounded-xl'} width={500} height={500} src={listing.node.images.picture_url} alt={listing.name}/>
              <div className={'mt-4'}>
                <h2 className={'font-bold'}>{listing.node.name}</h2>
                <p>{listing.node.summary}</p>
              </div>
            </div>
          </Link>
        )
        :
          <div className={'p-4 text-xl'}>Wishlist Empty</div>
        }
      </div>
    </div>
  )
}

export default Wishlist