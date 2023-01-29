import {useList} from "../context/ListContext";
import NavBar from "../components/NavBar";
import {gql, useQuery} from "@apollo/client";
import Image from 'next/image'
import {useEffect} from "react";


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
      { data && state.list.length > 0 ? data?.listingsById.edges.map(listing =>
        <div key={listing.node.id}>
          <Image className={''} width={500} height={500} src={listing.node.images.picture_url} alt={""}/>
        </div>
      )
      :
        <div>Wishlist Empty</div>
      }
    </div>
  )
}

export default Wishlist