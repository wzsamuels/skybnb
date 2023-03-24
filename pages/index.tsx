import Head from 'next/head'
import Image from 'next/image'

import { gql, useQuery } from '@apollo/client'
import {useCallback, useEffect, useState} from "react";
import {useBottomScrollListener} from "react-bottom-scroll-listener";
import {StarIcon} from "@heroicons/react/20/solid";
import {AiOutlineHeart, AiFillHeart} from "react-icons/ai"
import Link from "next/link";
import Modal from "../components/Modal";
import Slider from "../components/Slider";
import PropertyTypeFilter from '../components/PropertyTypeFilter';
import {useList} from "../context/ListContext";
import NavBar from "../components/NavBar";

const GetListings = gql`
  query GetListing($first: Int, $after: String, $query: ListingInput, $maxPrice: Int, $minPrice: Int) {
    listings(first: $first, after: $after, query: $query, maxPrice: $maxPrice, minPrice: $minPrice) {
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

export default function Home() {
  const [filter, setFilter] = useState({minPrice: 0, maxPrice: 10000});
  const [query, setQuery] = useState({});
  const {data, loading, error, fetchMore} = useQuery(GetListings, {
    variables: {
      first: 20,
      query: query,
      maxPrice: filter.maxPrice,
      minPrice: filter.minPrice
    }
  })
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);
  const [sliderValue, setSliderValue] = useState({min: 0, max: 50.00})
  const [sliderNumValue, setSliderNumValue] = useState(50)
  const {dispatch, state} = useList();

  const { endCursor, hasNextPage } = data?.listings.pageInfo || {};

  useEffect(() => {
    console.log(data)
  }, [data])

  const handleOnDocumentBottom = useCallback(() => {7
    if(hasNextPage) {
      setShowLoadingPopup(true);
      fetchMore({
        variables: {after: endCursor},
        updateQuery: (prevResult, {fetchMoreResult}) => {
          fetchMoreResult.listings.edges = [
            ...prevResult.listings.edges,
            ...fetchMoreResult.listings.edges,
          ];
          return fetchMoreResult;
        },
      }).then(r => {
        console.log(r);
        setShowLoadingPopup(false);
      }).catch(error => console.error(error));
    }
  }, [endCursor, fetchMore, hasNextPage]);

  useBottomScrollListener(handleOnDocumentBottom);

  const handlePropertyClick = (type: String) => {
    setQuery({...query, property_type: type});

  }

  if (error) return <p>Oh no... {error.message}</p>
  // @ts-ignore
  return (
    <div>
      <Head>
        <title>SkyBnb</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={'sticky top-0 z-10 bg-white shadow-lg'}>
        <NavBar>
          <button
            onClick={() => setShowFilterModal(true)}
            className={'rounded-3xl px-6 py-2 border border-dark shadow-md opacity-70 hover:opacity-100'}
          >
            Filter
          </button>
        </NavBar>
        <hr/>
      <PropertyTypeFilter onFilterSelect={handlePropertyClick}/>
      </header>

      { loading &&
        <div className="flex flex-col items-center justify-center space-x-2 my-8">
          <h2 className={'my-8'}>Loading Listings...</h2>
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }

      <div className={'grid mx-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4'}>
        {data?.listings.edges.map((listing) =>
          <div key={listing.node.id} className={'relative'}>
            <Link href={`/rooms/${listing.node.id}`} className={'relative w-full h-full max-w-[350px] m-auto'}>
              <div className={'aspect-square '}>
                <Image className={'rounded-md w-full h-full object-cover'} src={listing.node.images.picture_url} width={500} height={500}
                       alt={''}/>
              </div>
              <div className={'flex justify-between items-center w-full'}>
                <h2 className={'font-semibold overflow-ellipsis'}>
                  {listing.node.address.country === "United States" ? `${listing.node.address.street.split(",")[0]},${listing.node.address.street.split(",")[1]}` : `${listing.node.address.street.split(",")[0]},${listing.node.address.street.split(",")[2]}` }
                </h2>
                { listing.node.review_scores.review_scores_rating > 0 ?
                  <span className={'flex items-center'}>
                    {(listing.node.review_scores.review_scores_rating / 100 * 5).toFixed(1)}
                    <StarIcon className={'ml-1 w-4 h-4'}/>
                  </span>
                  :
                  <span className={'text-sm'}>No Reviews</span>
                }
              </div>
              <p>{listing.node.property_type}</p>
              <p>${listing.node.price}</p>
            </Link>

            { state.list.includes(listing.node.id) ?
              <button onClick={() => dispatch({type: "remove", payload: listing.node.id})}>
                <AiFillHeart className={'w-6 h-6 absolute top-4 right-4 text-primary'}/>
              </button>
              :
              <button onClick={() => dispatch({type: "add", payload: listing.node.id})}>
                <AiOutlineHeart className={'w-6 h-6 absolute top-4 right-4 ' }/>
              </button>
            }

          </div>
        )}
      </div>
      <Modal show={showFilterModal} onClose={() => setShowFilterModal(false)} title={'Filters'}>
        <FilterModal setFilter={setFilter} onClose={() => setShowFilterModal(false)}/>
      </Modal>
      { showLoadingPopup &&
        <div className={'fixed bottom-4 flex justify-center w-full'}>
          <p className={'text-primary w-52 shadow-full rounded-xl bg-white py-2 px-4'}>Loading More Listings...</p>
        </div>
      }
    </div>
  )
}

const FilterModal = ({setFilter, onClose}) => {
  const [sliderValue, setSliderValue] = useState({min: 0, max: 1000})

  const handleFilterSubmit = () => {
    setFilter(state => { return {...state, minPrice: Math.round(sliderValue.min), maxPrice: Math.round(sliderValue.max)}})
    onClose()
  }

  return (
    <div className={'flex flex-col items-center'}>

      <div className={'w-full'}>
        <h1>Price Range</h1>
        <Slider min={0} max={1000} value={sliderValue} setValue={setSliderValue} color={"bg-primary"}/>
        <div className={'m-4 flex justify-center text-xl'}>
          ${sliderValue.min.toFixed(0)} - ${sliderValue.max.toFixed(0)}
        </div>
      </div>

      <button className={'bg-red-600 px-4 py-2 text-white rounded-xl'} onClick={handleFilterSubmit}>
        Search
      </button>
    </div>
  )
}
