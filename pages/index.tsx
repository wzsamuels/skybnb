import Head from 'next/head'
import Image from 'next/image'

import { gql, useQuery } from '@apollo/client'
import { useCallback, useEffect, useRef, useState} from "react";
import {useBottomScrollListener} from "react-bottom-scroll-listener";
import {StarIcon} from "@heroicons/react/20/solid";
import {HeartIcon} from "@heroicons/react/24/outline";
import {BiBuildingHouse, BiHotel} from "react-icons/bi";
import {BsBuilding, BsChevronLeft, BsChevronRight, BsHouseDoor, BsLadder} from "react-icons/bs";
import { MdApartment, MdCabin, MdOutlineFreeBreakfast} from "react-icons/md";
import {RiSailboatLine} from "react-icons/ri";
import {GiBarn, GiBunkBeds, GiCampfire, GiCaravan, GiCastle, GiFarmTractor, GiTreehouse} from "react-icons/gi";
import {IoEarthSharp} from "react-icons/io5";
import Link from "next/link";
import NavBar from "../components/NavBar";

const icons = [
  {
    text: "Houses",
    icon: BsHouseDoor,
    type: "House"
  },
  {
    icon: MdApartment,
    text: "Apartments",
    type: "Apartment"
  },
  {
    icon: BsBuilding,
    text: "Condos",
    type: "Condominium",
  },
  {
    icon: BiBuildingHouse,
    text: "Guesthouses",
    type: "Guesthouse",
  },
  {
    icon: GiBunkBeds,
    text: "Hostels",
    type: "Hostel",
  },
  {
    icon: BsLadder,
    text: "Lofts",
    type: "Loft"
  },
  {
    icon: MdOutlineFreeBreakfast,
    text: "B&B's",
    type: "Bed and breakfast",
  },
  {
    icon: BiHotel,
    text: "Hotels",
    type: "Hotel"
  },
  {
    icon: MdCabin,
    text: "Cabins",
    type: "Cabin",
  },
  {
    icon: GiFarmTractor,
    text: "Farms",
    type: "Farm stay",
  },
  {
    icon: RiSailboatLine,
    text: "Boats",
    type: "Boat"
  },
  {
    icon: GiCastle,
    text: "Castles",
    type: "Castle",
  },
  {
    icon: GiCampfire,
    text: "Campsites",
    type: "Campsite"
  },
  {
    icon: GiBarn,
    text: "Barns",
    type: "Barn",
  },
  {
    icon: GiCaravan,
    text: "Camper",
    type: "Camper/RV"
  },
  {
    icon: GiTreehouse,
    text: "Tree Houses",
    type:"Treehouse"
  },
  {
    icon: IoEarthSharp,
    text: "Earth Houses",
    type: "Earth house"
  }
]

const GetListings = gql`
  query GetListing($first: Int, $after: String, $query: ListingInput) {
    listings(first: $first, after: $after, query: $query) {
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
  const [filter, setFilter] = useState({});
  const {data, loading, error, fetchMore} = useQuery(GetListings, {
    variables: {first: 20, query: filter}
  })

  const { endCursor, hasNextPage } = data?.listings.pageInfo || {};

  const handleOnDocumentBottom = useCallback(() => {
    if(hasNextPage) {
      fetchMore({
        variables: {after: endCursor},
        updateQuery: (prevResult, {fetchMoreResult}) => {
          fetchMoreResult.listings.edges = [
            ...prevResult.listings.edges,
            ...fetchMoreResult.listings.edges,
          ];
          return fetchMoreResult;
        },
      }).then(r => console.log(r)).catch(error => console.error(error));
    }
  }, [endCursor, fetchMore, hasNextPage]);

  useBottomScrollListener(handleOnDocumentBottom);

  const handlePropertyClick = (type: String) => {
    setFilter({...filter, property_type: type});

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

      <header className={'pb-4 sticky top-0 z-10 bg-white  shadow-lg'}>
        <NavBar/>
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
          <Link href={`/rooms/${listing.node.id}`} key={listing.node.id} className={'relative w-full h-full max-w-[350px] m-auto'}>
            <div className={'aspect-square '}>
              <Image className={'rounded-md w-full h-full object-cover'} src={listing.node.images.picture_url} width={500} height={500}
                     alt={''}/>
            </div>
            <HeartIcon className={'w-6 h-6 absolute top-4 right-4'}/>
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
        )}
      </div>
    </div>
  )
}

const PropertyTypeFilter = ({onFilterSelect}) => {
  const [lastScroll, setLastScroll] = useState(0);
  const [scrollCount, setScrollCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    console.log(`lastScroll ${lastScroll}, scrollCount: ${scrollCount}`)
  })

  /** Determine direction of scroll and adjust scroll offset **/
  const handleScroll = (event) => {
    // Event will fire many times. Only adjust scroll count once per scroll.
    if(scrolled) {
      if (lastScroll < event.currentTarget.scrollLeft) {
        setScrollCount(scrollCount + 1);
      } else {
        setScrollCount(scrollCount - 1);
      }
      setLastScroll(event.currentTarget.scrollLeft)
      setScrolled(false);
    }
    setLastScroll(event.currentTarget.scrollLeft);
  }

  const handlePropertyScrolled = (direction: String) => {
    setScrolled(true);
    if (direction === "left" && scrollCount > 0) {
      scrollDiv?.current?.scrollTo((scrollCount - 1) * 200, 0);
    } else if (direction === "right" ) {
      scrollDiv?.current?.scrollTo((scrollCount + 1) * 200, 0);
    }
  }
  const scrollDiv = useRef(null)

  return (
    <div className={'flex pl-4 relative '}>
      <div onScroll={handleScroll} className={'flex scroll-smooth overflow-hidden items-center gap-12 bg-white relative transition-all'} ref={scrollDiv}>
        {icons.map(icon =>
          <button
            key={icon.text} onClick={() => onFilterSelect(icon.type)} className={'flex flex-col items-center opacity-70 hover:opacity-100'}>
            <icon.icon className={'w-6 h-6'}/>
            <span className={'text-sm'}>{icon.text}</span>
          </button>
        )}
      </div>
      {
        scrollCount > 0 &&
        <div className={'absolute w-auto h-full bg-white z-20 flex justify-end items-center left-0'}>
          <button onClick={() => handlePropertyScrolled("left")}
                  className={'rounded-full border border-dark p-1 mx-4 opacity-70 hover:opacity-100'}>
            <BsChevronLeft/>
          </button>
        </div>
      }
      <div className={'absolute w-auto h-full bg-white z-20 flex justify-end items-center right-0'}>
        <button onClick={() => handlePropertyScrolled("right")}
                className={'rounded-full border border-dark p-1 mx-4 opacity-70 hover:opacity-100'}>
          <BsChevronRight/>
        </button>
        <button className={'rounded-3xl px-6 py-2 border border-dark shadow-md opacity-70 hover:opacity-100'}>Filter</button>
      </div>
    </div>
  )
}