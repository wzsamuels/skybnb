import {createRef, useEffect, useRef, useState} from "react";
import {BiBuildingHouse, BiHotel} from "react-icons/bi";
import {BsBuilding, BsChevronLeft, BsChevronRight, BsHouseDoor, BsLadder} from "react-icons/bs";
import { MdApartment, MdCabin, MdOutlineFreeBreakfast} from "react-icons/md";
import {RiSailboatLine} from "react-icons/ri";
import {GiBarn, GiBunkBeds, GiCampfire, GiCaravan, GiCastle, GiFarmTractor, GiTreehouse} from "react-icons/gi";
import {IoEarthSharp} from "react-icons/io5";
import useWindowDimensions from "../lib/useWindowDimensions"

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

type Direction = "left" | "right" | "none";

const PropertyTypeFilter = ({onFilterSelect}) => {
  const [scrollCount, setScrollCount] = useState(0);
  const [refs, setRefs] = useState([]);
  const [lastDirection, setLastDirection] = useState<Direction>("none");
  const dimensions = useWindowDimensions();

  const BREAKPOINT = 700;
  const SM_SHIFT = 7;
  const LG_SHIFT = 9;

  useEffect(() => {
    // add or remove refs
    setRefs((refs) =>
      Array(icons.length)
        .fill(0)
        .map((_, i) => refs[i] || createRef()),
    );
  }, []);

  const handlePropertyScrolled = (direction: Direction) => {
    let shift;
    if (direction === "left" && scrollCount > 0) {
      if(lastDirection === "left") {
        shift = -3;
      } else {
        shift = dimensions.width <= BREAKPOINT ? -7 : -9;
      }
      setLastDirection("left");
      // Prevent scrolling past beginning
      if(scrollCount + shift < 0) {
        refs[0].current.scrollIntoView();
        setScrollCount(0);
      }
      else {
        refs[scrollCount + shift].current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        setScrollCount(prevState => prevState + shift)
      }
    } else if (direction === "right") {
      if (lastDirection === "none" || lastDirection === "left") {
        shift = dimensions.width > BREAKPOINT ? 9 : 7;
      } else if (lastDirection === "right") {
        shift = 3;
      }
      setLastDirection("right");
      if(scrollCount + shift > refs.length - 3) {
        refs[refs.length - 1].current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        setScrollCount(refs.length - 1);
      } else {
        refs[scrollCount + shift].current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        setScrollCount(prevState => prevState + shift)
      }
    }
  }
  const scrollDiv = useRef(null)

  return (
    <div className={'flex relative'}>
      <div className={`flex py-2 ${scrollCount > 3 ? 'pl-[58px]' : 'pl-4' } ${(scrollCount < refs.length - 4) ? 'pr-[58px]' : 'pr-4'} scroll-smooth overflow-hidden items-center gap-4 sm:gap-8 md:gap-12 bg-white relative transition-all`} ref={scrollDiv}>
        { icons.map((icon, index) =>
          <button
            ref={refs[index]}
            key={icon.text}
            onClick={() => onFilterSelect(icon.type)}
            className={'flex flex-col items-center opacity-70 hover:opacity-100'}
          >
            <icon.icon className={'w-6 h-6'}/>
            <span className={'text-sm'}>{icon.text}</span>
          </button>
        )}
      </div>
      {
        (scrollCount > 3 && dimensions.width > BREAKPOINT || scrollCount > 1 && dimensions.width <= BREAKPOINT) &&
        <div className={'absolute w-auto h-full bg-white z-20 flex justify-end items-center left-0'}>
        <button onClick={() => handlePropertyScrolled("left")}
        className={'rounded-full border border-dark p-1 mx-2 md:mx-4 opacity-70 hover:opacity-100'}>
          <BsChevronLeft/>
          </button>
          </div>
      }
      { (scrollCount < refs.length - 4 || scrollCount < refs.length - 3 && dimensions.width <= BREAKPOINT) &&
      <div className={'absolute w-auto h-full bg-white z-20 flex justify-end items-center right-0'}>
        <button onClick={() => handlePropertyScrolled("right")}
          className={'rounded-full border border-dark p-1 mx-4 opacity-70 hover:opacity-100'}>
          <BsChevronRight/>
        </button>
      </div>
    }
    </div>
  )
}

export default PropertyTypeFilter