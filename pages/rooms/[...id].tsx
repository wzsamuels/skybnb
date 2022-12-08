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
import {useEffect, useState} from "react";
import NavBar from "../../components/NavBar";

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
          amenities
      }
  }
`

const Listing = () => {
  const router = useRouter()
  const { id } = router.query
  const [amenities, setAmenities] = useState([]);
  console.log(id)
  const {data, error, loading} = useQuery(GetListing, { variables: {query: {id: id[0]}}})
  useEffect(() => {
    if(data) { // @ts-ignore
      setAmenities([...new Set(data.listing.amenities)])
    }
  },[data])
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
    <div className={'w-full max-w-[900px]'}>
      { loading &&
        <div className="flex flex-col items-center justify-center space-x-2 my-8">
          <h1 className={'my-8'}>Loading Listing...</h1>
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
      {
        data &&
        <div>
          <Image src={data.listing.images.picture_url} width={500} height={500} alt={''}/>
          Bathrooms: {data.listing.bathrooms}
          <h2>Amenities</h2>
          <ul className={'grid grid-cols-2'}>
            { amenities.map((item) => {
              let Icon = getIcon(item);
              if(Icon) {
                return <li className={'flex'} key={item}><Icon className={'w-6 h-6'}/>{item}</li>
              }
              return null;
            })}
          </ul>
        </div>
      }
    </div>
    </div>
      </>
  )
}


export default Listing