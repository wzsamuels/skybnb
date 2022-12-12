import { gql } from '@apollo/client'
import Image from "next/image";
import {
  AiFillStar,
  AiOutlineBell,
  AiOutlineCoffee,
  AiOutlineColumnWidth,
  AiOutlineLock,
  AiOutlineTrophy
} from "react-icons/ai";
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
  GiWashingMachine, GiWeightLiftingUp
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
  MdPets, MdPool,
  MdSmokingRooms,
  MdWbShade
} from "react-icons/md"
import { BiAlarmExclamation, BiBed, BiFirstAid } from "react-icons/bi";
import {CgSmartHomeRefrigerator, CgSmartHomeWashMachine} from "react-icons/cg"
import {FiClock}
 from "react-icons/fi";
import {RiAlarmWarningLine} from "react-icons/ri";
import {Fragment, useState} from "react";
import NavBar from "../../components/NavBar";
import apolloClient from "../../lib/apollo";
import ProgressBar from "../../components/Progress";
import {StarIcon} from "@heroicons/react/20/solid";
import Modal from "../../components/Modal";
const GetListing = gql`
  query GetListing($query: ListingInput!) {
      listing(query: $query) {
          id
          bathrooms
          bedrooms
          beds
          bed_type
          number_of_reviews
          name
          accommodates
          description
          summary
          space
          neighborhood_overview
          property_type
          guests_included
          host {
            host_name
            host_is_superhost
          }
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
          address {
            street
            location {
              type
              coordinates
            }
          }
          room_type
          amenities
      }
  }
`

export async function getServerSideProps(ctx: { params: { id: string; }; }) {
  const { data, error } = await apolloClient.query({
    query: GetListing, variables: {query: {id: ctx.params.id[0]}}
  });
  // @ts-ignore
  const amenities = [...new Set(data.listing.amenities)]

  const res = await fetch(`https://api.unsplash.com/photos/random?client_id=v02k1NX-98Yma-9c5-lU0BrKTM3YCrz8i6p1YMDz8jE&query=room&count=4`, {
    method: 'GET',
  })
  const roomImages = await res.json();

  return {
    props: {
      listing: data.listing,
      amenities: amenities ? amenities: null,
      error: error ? error : null,
      roomImages
    },
  };
}

const Listing = ({listing,amenities,error, roomImages}) => {
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const openReviewDialog = () => setShowReviewDialog(true);
  const closeReviewDialog = () => setShowReviewDialog(false);

  if(error) {
    console.error(`Error ${error}`);
    return <h1 className={'text-3xl'}>Error Loading Listing. Error details logged to console.</h1>
  }

  console.log(roomImages)
  return (
    <>
      <NavBar className={'shadow'}/>
      <div className={'flex justify-center w-full'}>
        <div className={'w-full max-w-[1080px] px-4'}>
          <div className={'flex flex-col-reverse md:flex-col'}>
            <div>
              <h1 className={'text-3xl pt-6 '}>{listing.name}</h1>
              <div className={'flex items-center mt-2'}>
                <AiFillStar className={'mr-1 w-4 h-4'}/>
                {(listing.review_scores.review_scores_rating / 100 * 5).toFixed(1)}
                <span className={'font-bold px-1'}>·</span>
                <span>{listing.reviews.length} reviews</span>
                <span className={'font-bold px-1'}>·</span>
                { listing.host_is_superhost &&
                  <span>
                    <AiOutlineTrophy/> Superhost
                    <span className={'font-bold px-1'}>·</span>
                  </span>
                }
                <span className={'underline'}>{listing.address.street}</span>
              </div>
            </div>
            <div className={'grid grid-cols-4 grid-rows-2 gap-2 pt-6'}>
              <Image className={'rounded-l-xl col-span-2 row-span-2 w-full h-full object-cover'} src={listing.images.picture_url} width={560} height={560} alt={''}/>
              { roomImages && roomImages.map((roomImage, index) =>
                <Image
                  key={roomImage.id}
                  className={`w-full h-full object-cover aspect-square ${index === 1 && "rounded-tr-xl"} ${index === 3 && "rounded-br-xl"}`}
                  src={roomImage.urls.regular} width={300} height={300} alt={''}/>
              )}
            </div>
          </div>

          <div className={'flex gap-4'}>
            <div className={'w-2/3'}>
              <div className={'flex justify-between py-6 md:pt-8'}>
                <div>
                  <div>{listing.property_type} hosted by {listing.host.host_name}</div>
                  <div>{listing.guests_included} guest{listing.guests_included > 1 ? "s" : ""} · {listing.bedrooms > 0 && `${listing.bedrooms} bedroom${listing.bedrooms > 1 ? "s" : ""} · `}
                    {listing.beds} bed{listing.beds > 1 ? "s" : ""} · {listing.bathrooms} bath
                    {listing.bathrooms > 1 && "s"}</div>
                </div>
                <Image className={'rounded-full'} src={'https://thispersondoesnotexist.com/image'} width={56} height={56} alt={'AI Generated Host Image'}/>
              </div>

              <section className={'border-t border-gray-300 py-6 md:py-8'}>
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

              <section className={'border-t border-gray-300 py-6 md:py-8'}>
                {listing.summary}
                <button className={'underline'}>Learn more</button>
              </section>
            </div>
            <div className={'hidden w-1/3 md:block'}>
              <div className={'rounded-xl shadow border border-gray-300 p-6'}>
                ${listing.price} night
              </div>
            </div>
          </div>

          { listing.reviews && listing.reviews.length !== 0 &&
            <section className={'border-t border-gray-300 py-6 md:py-8 flex flex-col'}>
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
              <ul className={'grid sm:grid-cols-2 grid-cols-1 gap-4 mt-4'}>
                { listing.reviews?.map((review, index) =>
                  <Fragment key={review.id}>
                    { index < 6 &&
                      <li className={'my-2'}>
                        <p className={'font-bold'}>{review.reviewer_name}</p>
                        <p>{`${(new Date(review.date)).getMonth()+1}/${(new Date(review.date)).getDay()+1}/${(new Date(review.date)).getFullYear()}`}</p>
                        <p className={'line-clamp-4'}>{review.comments}</p>
                      </li>
                    }
                  </Fragment>
                )}
              </ul>
              { listing.reviews.length > 6 &&
                <div className={'w-full flex justify-center'}>
                  <button className={'border border-black rounded px-4 py-2'} onClick={openReviewDialog}>Read All {listing.reviews.length} Reviews</button>
                </div>
              }
            </section>
          }
          <section className={'border-t border-gray-300 py-6 md:py-8'}>
            <h2 className={'text-xl'}>Where you&apos;ll be</h2>
            <h3 className={'font-bold'}>{listing.address.street}</h3>
            <p>{listing.neighborhood_overview}</p>
            <p>{listing.space}</p>
          </section>
          <section>
            <div>
              <Image className={'rounded-full'} src={'https://thispersondoesnotexist.com/image'} width={56} height={56} alt={'AI Generated Host Image'}/>
            </div>
          </section>
        </div>
      </div>

      <Modal show={showReviewDialog} onClose={closeReviewDialog} title={"Reviews"}>
        <ul className={'bg-white '}>
          { listing.reviews?.map(review =>
            <li key={review.id} className={'my-4'}>
              <p className={'font-bold'}>{review.reviewer_name}</p>
              <p>{`${(new Date(review.date)).getMonth()+1}/${(new Date(review.date)).getDay()}/${(new Date(review.date)).getFullYear()}`}</p>
              <p>{review.comments}</p>
            </li>
          )}
        </ul>
      </Modal>
    </>
  )
}

const getIcon = (amenity = "") => {
  if(amenity.includes("translation missing")) {
    return null;
  }
  if(amenity) {
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
      case "Gym":
        return GiWeightLiftingUp;
      case "Pool":
        return MdPool;
      default:
        return GrDownloadOption;
    }
  }
}

export default Listing