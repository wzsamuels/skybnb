import {useRouter} from "next/router";
import { gql, useQuery } from '@apollo/client'
import Image from "next/image";
import {AiOutlineBell, AiOutlineCoffee, AiOutlineColumnWidth, AiOutlineLock} from "react-icons/ai";
import {BsCalendarMonth, BsWifi} from "react-icons/bs"
import {GrDownloadOption, GrElevator} from "react-icons/gr"
import {
  FaBabyCarriage,
  FaFireExtinguisher,
  FaIntercom,
  FaLaptop,
  FaNetworkWired,
  FaPumpSoap, FaRegLightbulb, FaShower,
  FaWater, FaWheelchair
} from "react-icons/fa"
import {
  GiArchiveRegister, GiChickenOven,
  GiCookingPot,
  GiCooler,
  GiHeatHaze, GiKnifeFork,
  GiPerson,
  GiPillow,
  GiWashingMachine
} from "react-icons/gi"
import {TbBeach, TbDeviceTvOld, TbGrill, TbHanger, TbMoodKid, TbParking, TbStairs, TbToolsKitchen} from "react-icons/tb"
import {
  MdCable,
  MdEventAvailable,
  MdKitchen,
  MdLuggage, MdOutlineBedroomChild,
  MdOutlineCleaningServices,
  MdOutlineCoffeeMaker,
  MdOutlineDry,
  MdOutlineFreeBreakfast,
  MdOutlineIron,
  MdOutlineLocalLaundryService,
  MdOutlineMicrowave, MdOutlineMiscellaneousServices, MdOutlinePrivacyTip, MdOutlineToys,
  MdPets,
  MdSmokingRooms,
  MdWbShade
} from "react-icons/md"
import {
  BiAlarmExclamation,
  BiBed,
  BiFirstAid } from "react-icons/bi";
import {CgSmartHomeRefrigerator,
  CgSmartHomeWashMachine} from "react-icons/cg"
import {FiClock}
 from "react-icons/fi";
import {RiAlarmWarningLine} from "react-icons/ri";

import {Fragment , useState} from "react";
import NavBar from "../../components/NavBar";
import apolloClient from "../../lib/apollo";
import {Dialog, Transition } from "@headlessui/react";
import ProgressBar from "../../components/Progress";
import {StarIcon} from "@heroicons/react/20/solid";
import GoogleMapReact from 'google-map-react';
const GetListing = gql`
  query GetListing($query: ListingInput!) {
      listing(query: $query) {
          id
          bathrooms
          bed_type
          accommodates
          images {
              picture_url
          }
          reviews {
              comments
              date
              id
              listing_id
              reviewer_id
              reviewer_name
          }
          review_scores {
              review_scores_accuracy
              review_scores_checkin
              review_scores_cleanliness
              review_scores_communication
              review_scores_location
              review_scores_rating
              review_scores_value
          }
          room_type
          amenities
      }
  }
`
const AnyReactComponent = ({ text }) => <div>{text}</div>;

export async function getServerSideProps(ctx: { params: { id: string; }; }) {
  const { data, error } = await apolloClient.query({
    query: GetListing, variables: {query: {id: ctx.params.id[0]}}
  });
  // @ts-ignore
  const amenities = [...new Set(data.listing.amenities)]
  let reviewScores = [];
  console.log(data)


  return {
    props: {
      listing: data.listing,
      amenities: amenities ? amenities: null,
      error: error ? error : null
    },
  };
}

const Listing = ({listing, amenities, error}) => {
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const openReviewDialog = () => setShowReviewDialog(true);
  const closeReviewDialog = () => setShowReviewDialog(false);
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };

  if(error) return <h1 className={'text-3xl'}>Error Loading Listing</h1>
  const getIcon = (amenity = "") => {
    if(amenity.includes("translation missing")) {
      return null;
    }
    switch (amenity) {
      case "TV":
        return TbDeviceTvOld;
      case "Wifi":
        return BsWifi;
      case "Internet":
        return FaNetworkWired;
      case "Dryer":
        return MdOutlineLocalLaundryService;
      case "Hangers":
        return TbHanger;
      case "Heating":
        return GiHeatHaze;
      case "Air conditioning":
        return GiCooler;
      case "Smoking allowed":
        return MdSmokingRooms;
      case "Washer":
        return GiWashingMachine;
      case "Free parking on premises":
        return TbParking;
      case "Fire extinguisher":
        return FaFireExtinguisher;
      case "Laptop friendly workspace":
        return FaLaptop;
      case "Building staff":
        return GiPerson;
      case "Family/kid friendly":
        return TbMoodKid;
      case "Shampoo":
        return FaPumpSoap;
      case "Self check-in":
        return GiArchiveRegister;
      case "Essentials":
        return AiOutlineCoffee;
      case "Suitable for events":
        return MdEventAvailable;
      case "Hair dryer":
        return MdOutlineDry
      case "Iron":
        return MdOutlineIron;
      case "Smoking Allowed":
        return MdSmokingRooms
      case "Kitchen":
        return MdKitchen;
      case "Microwave":
        return MdOutlineMicrowave;
      case "Refrigerator":
        return CgSmartHomeRefrigerator;
      case "Dishwasher":
        return CgSmartHomeWashMachine;
      case "Cable TV":
        return MdCable;
      case "First aid kit":
        return BiFirstAid;
      case "Pets allowed":
        return MdPets;
      case "Hot water":
        return FaWater;
      case "Extra pillows and blankets":
        return GiPillow;
      case "Room-darkening shades":
        return MdWbShade;
      case "Paid parking off premises":
        return TbParking;
      case "Cooking basics":
        return TbToolsKitchen;
      case "Waterfront":
        return TbBeach;
      case "Bed linens":
        return BiBed;
      case "Dishes and silverware":
        return GiKnifeFork;
      case "Oven":
        return GiChickenOven;
      case "Stove":
        return GiCookingPot;
      case "Buzzer/wireless intercom":
        return FaIntercom;
      case "Cleaning before checkout":
        return MdOutlineCleaningServices
      case "Coffee maker":
        return MdOutlineCoffeeMaker;
      case "Pack ’n Play/travel crib":
        return FaBabyCarriage;
      case "Elevator":
        return GrElevator;
      case "Doorman":
        return AiOutlineBell;
      case "Long term stays allowed":
        return BsCalendarMonth;
      case "Wide hallway clearance":
        return AiOutlineColumnWidth;
      case "Host greets you":
        return GiPerson;
      case "24-hour check-in":
        return FiClock;
      case "Smoke detector":
        return BiAlarmExclamation;
      case "Luggage dropoff allowed":
        return MdLuggage;
      case "Lock on bedroom door":
        return AiOutlineLock;
      case "Wheelchair accessible":
        return FaWheelchair;
      case "Wide doorway":
        return AiOutlineColumnWidth;
      case "Breakfast":
        return MdOutlineFreeBreakfast;
      case "BBQ grill":
        return TbGrill;
      case "Children’s books and toys":
        return MdOutlineToys;
      case "Other":
        return MdOutlineMiscellaneousServices;
      case "Carbon monoxide detector":
        return RiAlarmWarningLine;
      case "Private entrance":
        return MdOutlinePrivacyTip;
      case "Wide clearance to bed":
        return AiOutlineColumnWidth;
      case "Well-lit path to entrance":
        return FaRegLightbulb;
      case "Handheld shower head":
        return FaShower;
      case "Accessible-height bed":
        return MdOutlineBedroomChild
      case "Step-free access":
        return TbStairs;
      default:
        return GrDownloadOption;
    }
  }

  return (
    <>
      <NavBar className={'shadow'}/>
      <div className={'flex justify-center w-full'}>
        <div className={'w-full max-w-[1080px] px-4'}>
            <div>
              <Image src={listing.images.picture_url} width={500} height={500} alt={''}/>
              <span>{listing.room_type} | Bathrooms: {listing.bathrooms}</span>
              {
                <section className={'border-t border-gray-300 py-8 md:py-16'}>
                  <h2 className={'text-xl font-bold pb-4'}>Amenities</h2>
                  <ul className={'grid grid-cols-2 gap-2'}>
                    { amenities.map((item) => {
                      let Icon = getIcon(item);
                      if(Icon) {
                        return <li className={'flex'} key={item}><Icon className={'w-6 h-6'}/>{item}</li>
                      }
                      return null;
                    })}
                  </ul>
                </section>
              }
              { listing.reviews && listing.reviews.length !== 0 &&
                <section className={'border-t border-gray-300 py-8 md:py-16 flex flex-col'}>
                  <h2 className={'text-xl flex items-center font-bold pb-4'}>
                    <StarIcon className={'mr-4 w-4 h-4'}/>
                    {(listing.review_scores.review_scores_rating / 100 * 5).toFixed(1)}
                    {' '}·{' '}{listing.reviews.length} reviews
                  </h2>
                  <div className={'grid grid-cols-2 gap-2'}>
                    <div className={'flex items-center justify-between'}>
                      <div className={'basis-auto'}>Cleanliness</div>
                      <div className={'min-w-auto basis-[50%] items-center flex'}>
                        <ProgressBar percent={listing.review_scores.review_scores_cleanliness * 10}/>
                        <span className={'ml-2'}>{listing.review_scores.review_scores_cleanliness}</span>
                      </div>
                    </div>
                    <div className={'flex items-center justify-between'}>
                      <div className={'basis-auto'}>Accuracy</div>
                      <div className={'min-w-auto basis-[50%] items-center flex'}>
                        <ProgressBar percent={listing.review_scores.review_scores_accuracy * 10}/>
                        <span className={'ml-2'}>{listing.review_scores.review_scores_accuracy}</span>
                      </div>
                    </div>
                    <div className={'flex items-center justify-between'}>
                      <div className={'basis-auto'}>Communication</div>
                      <div className={'min-w-auto basis-[50%] items-center flex'}>
                        <ProgressBar percent={listing.review_scores.review_scores_communication * 10}/>
                        <span className={'ml-2'}>{listing.review_scores.review_scores_communication}</span>
                      </div>
                    </div>
                    <div className={'flex items-center justify-between'}>
                      <div className={'basis-auto'}>Location</div>
                      <div className={'min-w-auto basis-[50%] items-center flex'}>
                        <ProgressBar percent={listing.review_scores.review_scores_location * 10}/>
                        <span className={'ml-2'}>{listing.review_scores.review_scores_location}</span>
                      </div>
                    </div>
                    <div className={'flex items-center justify-between'}>
                      <div className={'basis-auto'}>Check-in</div>
                      <div className={'min-w-auto basis-[50%] items-center flex'}>
                        <ProgressBar percent={listing.review_scores.review_scores_checkin * 10}/>
                        <span className={'ml-2'}>{listing.review_scores.review_scores_checkin}</span>
                      </div>
                    </div>
                    <div className={'flex items-center justify-between'}>
                      <div className={'basis-auto'}>Value</div>
                      <div className={'min-w-auto basis-[50%] items-center flex'}>
                        <ProgressBar percent={listing.review_scores.review_scores_value * 10}/>
                        <span className={'ml-2'}>{listing.review_scores.review_scores_value}</span>
                      </div>
                    </div>
                  </div>
                  <ul className={'grid sm:grid-cols-2 grid-cols-1 gap-4'}>
                    { listing.reviews?.map((review, index) =>
                      <>
                        { index < 6 &&
                          <li key={review.id} className={'my-4'}>
                            <p className={'font-bold'}>{review.reviewer_name}</p>
                            <p>{`${(new Date(review.date)).getMonth()+1}/${(new Date(review.date)).getDay()}/${(new Date(review.date)).getFullYear()}`}</p>
                            <p className={'line-clamp-4'}>{review.comments}</p>
                          </li>
                        }
                      </>
                    )}
                  </ul>
                  { listing.reviews.length > 6 &&
                    <div className={'w-full flex justify-center'}>
                      <button className={'border border-black rounded px-4 py-2'} onClick={openReviewDialog}>Read All {listing.reviews.length} Reviews</button>
                    </div>
                  }
                </section>
              }
            </div>
        </div>

      </div>


      <Transition show={showReviewDialog} as={Fragment}>
      <Dialog
        onClose={closeReviewDialog}
        className="relative z-50"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transition-all duration-500"
          enterFrom="top-[1000px]"
          enterTo="top-0"
          leave="transition-all duration-500"
          leaveFrom="bottom-0"
          leaveTo="top-[1000px]"
        >
          <div className="fixed inset-0 flex min-h-full items-center justify-center p-4" style={{overflow: "initial"}}>
            {/* The actual dialog panel  */}
              <Dialog.Panel className="mx-auto w-full max-w-[1080px] max-h-[99%] p-4 rounded bg-white overflow-y-scroll" >
                <Dialog.Title>Complete your order<button onClick={closeReviewDialog}>X</button></Dialog.Title>
                <ul className={'grid sm:grid-cols-2 grid-cols-1 gap-4 bg-white '}>
                  { listing.reviews?.map(review =>
                    <li key={review.id} className={'my-4'}>
                      <p className={'font-bold'}>{review.reviewer_name}</p>
                      <p>{`${(new Date(review.date)).getMonth()+1}/${(new Date(review.date)).getDay()}/${(new Date(review.date)).getFullYear()}`}</p>
                      <p className={'line-clamp-4'}>{review.comments}</p>
                    </li>
                  )}
                </ul>
              </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
      </Transition>
    </>
  )
}


export default Listing