import {gql, useQuery} from '@apollo/client'
import Image from "next/image";
import {
  AiFillStar,
  AiOutlineBell,
  AiOutlineCoffee,
  AiOutlineColumnWidth,
  AiOutlineLock, AiOutlinePlus,
  AiOutlineTrophy
} from "react-icons/ai";
import {BsCalendarMonth, BsHouse, BsWifi} from "react-icons/bs"
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
  GiArchiveRegister, GiCat, GiChickenOven,
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
  MdPets, MdPool, MdRoom,
  MdSmokingRooms,
  MdWbShade
} from "react-icons/md"
import { BiAlarmExclamation, BiBed, BiFirstAid } from "react-icons/bi";
import {CgSmartHomeRefrigerator, CgSmartHomeWashMachine} from "react-icons/cg"
import {FiClock} from "react-icons/fi";
import {RiAlarmWarningLine} from "react-icons/ri";
import {Fragment, useEffect, useState} from "react";
import NavBar from "../../components/NavBar";
import apolloClient from "../../lib/apollo";
import ProgressBar from "../../components/Progress";
import {StarIcon} from "@heroicons/react/20/solid";
import Modal from "../../components/Modal";
import GoogleMap from "../../components/GoogleMap";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import Calendar from "../../components/Calendar";
import {Popover} from "@headlessui/react";
import Link from "next/link";
import AccountMenu from "../../components/AccountMenu";
dayjs.extend(isBetween);

const GetListing = gql`
  query GetListing($query: ListingInput!) {
    listing(query: $query) {
      id


      bed_type

      name      
      summary
      space
      description
      neighborhood_overview
      notes
      transit
      access
      house_rules
      accommodates
      
      house_rules
      property_type
      room_type
      bed_type
      minimum_nights
      maximum_nights
      cancellation_policy
        
      guests_included
      bedrooms
      beds
      number_of_reviews
      bathrooms
      price
      security_deposit
      cleaning_fee
      host {
        host_name
        host_about
        host_response_time
        host_response_rate
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
  const id  = ctx.params.id[0]
  return {
    props: {
      id
    },
  };
}

const Listing = ({id}) => {

  const [showNeighborhoodModal, setShowNeighborhoodModal] = useState(false);
  const openNeighborhoodModal = () => setShowNeighborhoodModal(true);
  const closeNeighborhoodModal = () => setShowNeighborhoodModal(false);

  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const openReviewDialog = () => setShowReviewDialog(true);
  const closeReviewDialog = () => setShowReviewDialog(false);

  const { data, error,loading } = useQuery(GetListing,{variables: {query: {id}}});
  const [roomImages, setRoomImages] = useState(null);
  const [dates, setDates] = useState({startDate: null, endDate: null});
  const [guests, setGuests] = useState({adults: 0,  children: 0, infants: 0, pets: 0});
  // @ts-ignore
  const amenities = data ? [...new Set(data?.listing.amenities)] : null;

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch(`https://api.unsplash.com/photos/random?client_id=v02k1NX-98Yma-9c5-lU0BrKTM3YCrz8i6p1YMDz8jE&query=room&count=4`, {
        method: 'GET',
      })
      setRoomImages(await res.json());
    }
    fetchImages();

  },[])



  useEffect(() => {
    console.log(dates)
  },[dates])

  if(error) {
    console.error(`Error ${error}`);
    return <h1 className={'text-xl'}>Error Loading Listing. Error details logged to console.</h1>
  }

  /** Calculate the total to book the listing **/
  const total = (() => {
    if(dates.startDate && dates.endDate) {
      return (data?.listing.cleaning_fee + data?.listing.security_deposit + data?.listing.price * dates.endDate.diff(dates.startDate, 'day'))
    }
    return null;
  })();

  const renderScores = ()  => {
    return (
      <>
        <div className={'flex items-center justify-between'}>
          <div className={'basis-auto'}>Cleanliness</div>
          <div className={'min-w-auto basis-[50%] items-center flex'}>
            <ProgressBar percent={data?.listing.review_scores.review_scores_cleanliness * 10}/>
            <span className={'ml-2'}>{data?.listing.review_scores.review_scores_cleanliness}</span>
          </div>
        </div>
        <div className={'flex items-center justify-between'}>
          <div className={'basis-auto'}>Accuracy</div>
          <div className={'min-w-auto basis-[50%] items-center flex'}>
            <ProgressBar percent={data?.listing.review_scores.review_scores_accuracy * 10}/>
            <span className={'ml-2'}>{data?.listing.review_scores.review_scores_accuracy}</span>
          </div>
        </div>
        <div className={'flex items-center justify-between'}>
          <div className={'basis-auto'}>Communication</div>
          <div className={'min-w-auto basis-[50%] items-center flex'}>
            <ProgressBar percent={data?.listing.review_scores.review_scores_communication * 10}/>
            <span className={'ml-2'}>{data?.listing.review_scores.review_scores_communication}</span>
          </div>
        </div>
        <div className={'flex items-center justify-between'}>
          <div className={'basis-auto'}>Location</div>
          <div className={'min-w-auto basis-[50%] items-center flex'}>
            <ProgressBar percent={data?.listing.review_scores.review_scores_location * 10}/>
            <span className={'ml-2'}>{data?.listing.review_scores.review_scores_location}</span>
          </div>
        </div>
        <div className={'flex items-center justify-between'}>
          <div className={'basis-auto'}>Check-in</div>
          <div className={'min-w-auto basis-[50%] items-center flex'}>
            <ProgressBar percent={data?.listing.review_scores.review_scores_checkin * 10}/>
            <span className={'ml-2'}>{data?.listing.review_scores.review_scores_checkin}</span>
          </div>
        </div>
        <div className={'flex items-center justify-between'}>
          <div className={'basis-auto'}>Value</div>
          <div className={'min-w-auto basis-[50%] items-center flex'}>
            <ProgressBar percent={data?.listing.review_scores.review_scores_value * 10}/>
            <span className={'ml-2'}>{data?.listing.review_scores.review_scores_value}</span>
          </div>
        </div>
      </>
    )
  }

  const renderReviewCount = () => {
    return (
      <div className={'flex items-center'}>
        { data?.listing.number_of_reviews ?
          <>
            <AiFillStar className={'mr-1 w-4 h-4'}/>
            {(data?.listing.review_scores.review_scores_rating / 100 * 5).toFixed(2)}
            <span className={'font-bold px-1'}>·</span>
            <button onClick={openReviewDialog} className={'underline'}>{data?.listing.number_of_reviews} reviews</button>
          </>
          :
          <span>No reviews yet</span>
        }
      </div>
    )
  }

  return (
    <>
      <div className={`w-full shadow flex justify-center`}>
        <div className={'w-full max-w-[1280px] flex justify-between items-center px-6 md:px-[40px] lg:px-[80px]'}>
          <Link href={'/'} className={'px-4 py-2 bg-primary text-light my-2 rounded-3xl'}>SkyBnB</Link>
          <AccountMenu/>
        </div>
      </div>
      <div className={'flex justify-center w-full'}>
        <div className={'w-full max-w-[1280px] px-6 md:px-[40px] lg:px-[80px]'}>
          <div className={'flex flex-col-reverse md:flex-col'}>
            <div>
              <h1 className={'text-3xl pt-6 '}>{data?.listing.name}</h1>
              <div className={'flex items-center mt-2'}>
                { renderReviewCount() }
                <span className={'font-bold px-1'}>·</span>
                { data?.listing.host_is_superhost &&
                  <span>
                    <AiOutlineTrophy/> Superhost
                    <span className={'font-bold px-1'}>·</span>
                  </span>
                }
                <span className={'underline'}>{data?.listing.address.street}</span>
              </div>
            </div>
            <div className={'grid grid-cols-1 grid-rows-1 sm:grid-cols-4 sm:grid-rows-2 gap-2 pt-6'}>
              <Image className={'rounded-xl sm:rounded-r-none sm:rounded-l-xl col-span-2 row-span-2 w-full h-full object-cover'} src={data?.listing.images.picture_url} width={560} height={560} alt={''}/>
              { roomImages && roomImages.map((roomImage, index) =>
                <Image
                  key={roomImage.id}
                  className={`hidden sm:block w-full h-full object-cover aspect-square ${index === 1 && "rounded-tr-xl"} ${index === 3 && "rounded-br-xl"}`}
                  src={roomImage.urls.regular} width={300} height={300} alt={''}/>
              )}
            </div>
          </div>

          <div className={'flex justify-between'}>
            <div className={'w-full md:w-7/12'}>
              <div className={'flex justify-between py-6 md:pt-12'}>
                <div>
                  <div className={'text-2xl'}>{data?.listing.property_type} hosted by {data?.listing.host.host_name}</div>
                  <div>{data?.listing.guests_included} guest{data?.listing.guests_included > 1 ? "s" : ""} · {data?.listing.bedrooms > 0 && `${data?.listing.bedrooms} bedroom${data?.listing.bedrooms > 1 ? "s" : ""} · `}
                    {data?.listing.beds} bed{data?.listing.beds > 1 ? "s" : ""} · {data?.listing.bathrooms} bath
                    {data?.listing.bathrooms > 1 && "s"}</div>
                </div>
                <div className={'aspect-square'}>
                  <Image className={'rounded-full'} src={'https://thispersondoesnotexist.com/image'} width={56} height={56} alt={'AI Generated Host Image'}/>
                </div>
              </div>

              { (data?.listing.room_type || data?.listing.bed_type || data?.listing.cancellation_policy) &&
                <section className={'border-t border-gray-300 py-4 md:py-6'}>
                  { data?.listing.room_type &&
                  <div>
                    <h3 className={'flex items-center font-bold py-2'}><BsHouse className={'mr-2'}/>{data?.listing.room_type}</h3>
                  </div>
                  }
                  { data?.listing.bed_type &&
                    <div>
                      <h3 className={'flex items-center font-bold py-2'}><BiBed className={'mr-2'}/>{ data?.listing.bed_type}</h3>
                    </div>

                  }
                  { data?.listing.cancellation_policy &&
                    <div>
                      <h3 className={'flex items-center font-bold py-2'}><BsCalendarMonth className={'mr-2'}/>Cancellation Policy:&nbsp;<span className={'capitalize '}>{ data?.listing.cancellation_policy}</span></h3>
                    </div>
                  }
                </section>
              }

              <Description listing={data?.listing}/>
              <Amenities amenities={amenities}/>
              <section className={'border-t border-gray-300 py-6 md:py-8'}>
                <Calendar dates={dates} setDates={setDates}/>
              </section>
            </div>
            {/*dates={dates} setDates={setDates}*/}
            <div className={'hidden w-1/3 md:block'}>
              <div className={'mt-12 mb-12 ml-[8%] rounded-xl sticky top-12 shadow border border-gray-300 p-6'}>
                <div className={'flex justify-between flex-wrap mb-4'}>
                  <p className={'text-lg font-bold'}>${data?.listing.price} night</p>
                  { renderReviewCount() }
                </div>

                <Popover>
                  {({close}) => (
                    <>
                      <Popover.Button
                        className={'border border-black rounded-t-lg flex truncate w-full hover:border-2 '}>
                        <div className={'w-1/2 border-r border-black'}>
                          <div className={'pt-1 pb-3 px-3'}>
                            <p className={'text-[10px] uppercase pb-1 truncate'}>Check-in</p>
                            { dates.startDate ?
                              <p className={'truncate  text-sm'}>{dates.startDate.format('MM/DD/YYYY')}</p>
                              :
                              <p className={'truncate text-sm'}>Add date</p>
                            }
                          </div>
                        </div>
                        <div className={'w-1/2 truncate'}>
                          <div className={'pt-1 pb-3 px-3 '}>
                            <p className={'text-[10px] uppercase pb-1 truncate'}>Checkout</p>
                            { dates.endDate ?
                              <p className={'truncate text-sm'}>{dates.endDate.format('MM/DD/YYYY')}</p>
                              :
                              <p className={'truncate text-sm'}>Add date</p>
                            }
                          </div>
                        </div>
                      </Popover.Button>
                      <Popover.Panel className={'absolute z-10 right-[50px] w-[660px] bg-white rounded shadow-full p-4'}>
                        <Calendar dates={dates} setDates={setDates} onClose={close}/>
                      </Popover.Panel>
                    </>
                  )}
                </Popover>

                <Popover>
                  {({close}) => (
                    <>
                      <Popover.Button className={'mb-4 border border-black rounded-b-lg flex truncate w-full hover:border-2 pl-3 pr-12'}>
                        <div className={''}>
                          Guests
                        </div>
                      </Popover.Button>
                      <Popover.Panel className={'absolute z-10 bg-white rounded shadow-full p-4'}>
                        <div className={'flex justify-between'}>
                          <div>
                            <div>Adults</div>
                            <div>Age 13+</div>
                          </div>
                          <div>
                            <button className={'rounded-full border p-1'}><AiOutlinePlus/></button>
                            <button className={'rounded-full border p-1'}><AiOutlinePlus/></button>
                          </div>
                        </div>

                      </Popover.Panel>
                    </>
                  )}
                </Popover>

                <div className={'flex justify-between w-full'}>
                  <span>Cleaning Fee</span>
                  <span>${data?.listing.cleaning_fee}</span>
                </div>
                <div>Security Deposit: ${data?.listing.security_deposit}</div>

                <button className={'py-2 px-4 rounded-xl bg-primary text-light'}>Reserve</button>
              </div>
            </div>

          </div>

          {/*Review Section*/}
          { data?.listing.reviews && data?.listing.reviews.length !== 0 &&
            <section className={'border-t border-gray-300 py-6 md:py-8 flex flex-col'}>
              <h2 className={'text-xl flex items-center font-bold pb-4'}>
                <StarIcon className={'mr-4 w-4 h-4'}/>
                {(data?.listing.review_scores.review_scores_rating / 100 * 5).toFixed(1)}
                {' '}·{' '}{data?.listing.reviews.length} reviews
              </h2>

              <div className={'grid grid-cols-1 md:grid-cols-2 gap-2'}>
                { renderScores() }
              </div>

              <ul className={'grid sm:grid-cols-2 grid-cols-1 gap-4 mt-4'}>
                { data?.listing.reviews?.map((review, index) =>
                  <Fragment key={review.id}>
                    { index < 6 &&
                      <li className={'my-2'}>
                        <div className={'flex mb-4'}>
                          <Image className={'mr-2 rounded-full'} alt={''} width={52} height={52} src={`https://i.pravatar.cc/52?${index}`}/>
                          <div>
                            <p className={'font-bold'}>{review.reviewer_name}</p>
                            <p>{`${(new Date(review.date)).getMonth()+1}/${(new Date(review.date)).getDay()+1}/${(new Date(review.date)).getFullYear()}`}</p>
                          </div>
                        </div>
                        <p className={'line-clamp-4'}>{review.comments}</p>
                      </li>
                    }
                  </Fragment>
                )}
              </ul>

              { data?.listing.reviews.length > 6 &&
                <div className={'w-full mt-2'}>
                  <button className={'border border-black rounded px-4 py-2 w-full sm:w-auto'} onClick={openReviewDialog}>Read All {data?.listing.reviews.length} Reviews</button>
                </div>
              }
            </section>
          }

          <section className={'border-t border-gray-300 py-6 md:py-8'}>
            <h2 className={'text-xl my-4'}>Where you&apos;ll be</h2>
            <GoogleMap lat={data?.listing.address.location.coordinates[1]} lang={data?.listing.address.location.coordinates[0]}/>
            <h3 className={'font-bold my-4'}>{data?.listing.address.street}</h3>
            { data?.listing.neighborhood_overview &&
              <>
                <p className={'line-clamp-3'}>{data?.listing.neighborhood_overview}</p>
                <button onClick={openNeighborhoodModal} className={'underline my-4'}>Learn More</button>
              </>
            }

          </section>

          <section>
            <div className={'flex w-full justify-between'}>
              <h2 className={'text-xl'}>Hosted by {data?.listing.host.host_name}</h2>
              <Image className={'rounded-full'} src={'https://thispersondoesnotexist.com/image'} width={64} height={64} alt={'AI Generated Host Image'}/>
            </div>
              <div className={'grid grid-cols-1 md:grid-cols-2 grid-rows-1 gap-4'}>
                { data?.listing.host.host_about &&
                  <div>
                    <h3>About this host</h3>
                    <p>{data?.listing.host.host_about}</p>
                  </div>
                }
                <div className={'ml-[8%]'}>
                  {data?.listing.host.host_response_rate && <p>Response rate: {data?.listing.host.host_response_rate}</p>}
                  {data?.listing.host.host_response_time && <p>Response time: {data?.listing.host.host_response_time}</p>}
                </div>
              </div>

          </section>
        </div>
      </div>

      {/*Footer*/}
      <div className={'bottom-0 bg-gray-100 p-4'}>
        Footer
      </div>
      {/*Extra sticky for mobile*/}
      <div className={'sticky bottom-0 block md:hidden bg-white p-4 flex justify-between'}>
        <div>
          <div>
            <span className={'font-bold'}>{data?.listing.price} </span><span>night</span>
            { dates.startDate && dates.endDate ?
              <div className={'underline'}>
                {dates.startDate.format("MMM D")} - {dates.endDate.format("MMM D")}
              </div>
              :
              <div>

              </div>
            }
          </div>
        </div>
        <button className={'bg-primary text-white rounded-lg py-2 px-4'}>Reserve</button>
      </div>

      {/*Review Modal*/}
      <Modal show={showReviewDialog} onClose={closeReviewDialog} title={"Reviews"}>
        <div className={'grid grid-cols-1 md:grid-cols-2 grid-rows-1 relative'}>
          <div>
          <div className={'mb-4 flex flex-col gap-2 sticky top-0'}>
            <div className={'text-2xl'}>
              { renderReviewCount()}
            </div>
            { renderScores() }
          </div>
          </div>
          <ul className={'bg-white '}>
            { data?.listing.reviews?.map(review =>
              <li key={review.id} className={'mb-4'}>
                <p className={'font-bold'}>{review.reviewer_name}</p>
                <p>{`${(new Date(review.date)).getMonth()+1}/${(new Date(review.date)).getDay()+1}/${(new Date(review.date)).getFullYear()}`}</p>
                <p>{review.comments}</p>
              </li>
            )}
          </ul>
        </div>
      </Modal>

      <Modal background={false} show={showNeighborhoodModal} onClose={closeNeighborhoodModal} title={"Where You'll Be"} className={'h-full w-full'}>
        <div className={'flex'}>
          <div className={'basis-[400px]'}>
            <h3 className={'text-xl mb-4'}>Neighborhood</h3>
            <p>{data?.listing.neighborhood_overview}</p>
            <h3 className={'text-xl my-4'}>Transit</h3>
            <p>{data?.listing.transit}</p>
          </div>
          <div className={'w-[500px] h-full'}>
            <GoogleMap lat={data?.listing.address.location.coordinates[1]} lang={data?.listing.address.location.coordinates[0]}/>
          </div>
        </div>
      </Modal>
    </>
  )
}



const Description = ({listing}) => {
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const openDescriptionModal = () => setShowDescriptionModal(true);
  const closeDescriptionModal = () => setShowDescriptionModal(false);

  return (
    <>
      { listing &&
        <section className={'border-t border-gray-300 py-6 md:py-8'}>
          { listing.summary ?
            <p>{listing.summary}</p>
            :
            <p>{listing.description}</p>
          }
          <button onClick={openDescriptionModal} className={'underline mt-4'}>Learn more</button>

          <Modal show={showDescriptionModal} onClose={closeDescriptionModal} title={'About this space'}>
            { listing.description &&
              <>
                <h3 className={'font-bold'}>Description</h3>
                <p className={'mb-4'}>{listing.description}</p>
              </>
            }
            { listing.space &&
              <>
                <h3 className={'font-bold'}>Space</h3>
                <p className={'mb-4'}>{listing.space}</p>
              </>
            }
            { listing.notes &&
              <>
                <h3 className={'font-bold'}>Notes</h3>
                <p className={'mb-4'}>{listing.notes}</p>
              </>
            }
            { listing.access &&
              <>
                <h3 className={'font-bold'}>Guest Access</h3>
                <p className={'mb-4'}>{listing.access}</p>
              </>
            }
          </Modal>
        </section>
      }
    </>

  )
}

const Amenities = ({amenities}) => {
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const openAmenityModal = () => setShowAmenityModal(true);
  const closeAmenityModal = () => setShowAmenityModal(false);

  return (
    <>
      { amenities &&
        <section className={'border-t border-gray-300 py-6 md:py-8 w-full'}>
          <h2 className={'text-xl font-bold pb-4'}>Amenities</h2>
          <ul className={'grid grid-cols-2 gap-2'}>
            { amenities.map((item, index) => {
              if(index < 8) {
                let Icon = getIcon(item);
                if (Icon) {
                  return <li className={'flex'} key={item}><Icon className={'w-6 h-6'}/>{item}</li>
                }
              }
              return null;
            })}
          </ul>
          { amenities.length > 8 ?
            <button className={'border border-black rounded px-4 py-2 mt-6 w-full sm:w-auto'} onClick={openAmenityModal}>Show all {amenities.length} amenities</button>
            : null
          }

          <Modal show={showAmenityModal} onClose={closeAmenityModal} title={'Amenities'} className={'w-[780px]'}>
            <ul className={''}>
              { amenities.map((item, index) => {
                let Icon = getIcon(item);
                if (Icon) {
                  return <li className={'flex py-6 border-gray-300 border-b'} key={item}><Icon className={'w-6 h-6 mr-4'}/>{item}</li>
                }
                return null;
              })}
            </ul>
          </Modal>
        </section>
      }
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
      case "Pets live on this property":
      case "Pets allowed":
        return MdPets;
      case "Cat(s)":
        return GiCat;
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