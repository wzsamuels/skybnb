import NavBar from "../components/NavBar";
import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import AccountMenu from "../components/AccountMenu";

const Checkout = ({reservation, setReservation}) => {
  const nights = reservation.dates.endDate && reservation.dates.startDate ? reservation.dates.endDate.diff(reservation.dates.startDate, 'day') : null;
  const [message, setMessage] = useState("");
  console.log(reservation)

  if(!reservation) {
    return (
      <>
        <NavBar/>
        <div className={'p-4'}>
          No listing selected!
        </div>
      </>
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
          <h1 className={'text-2xl md:text-3xl mb-4 mt-6'}>Confirm Reservation</h1>
          <div className={'flex '}>
            <Image src={reservation?.listing?.images.picture_url} className={'h-auto mr-4 rounded-xl'} width={300} height={300} alt={"Listing Image"}/>
            <div>
              <p>{reservation?.listing?.property_type}</p>
              <p>{reservation?.listing?.bedrooms} bedrooms</p>
            </div>
          </div>

          <hr className={'my-2'}/>
          <section className={'my-4'}>
            <h2 className={'text-xl md:text-2xl my-2 font-bold'}>Trip Details</h2>
            <h3 className={'font-bold my-2'}>Dates</h3>
            <div>{reservation.dates.startDate.format('MMM D')} - {reservation.dates.endDate.format('MMM D')}</div>

            <h3 className={' font-bold my-2'}>Guests</h3>
            {reservation.guests.adults + reservation.guests.children} guest{reservation.guests.adults + reservation.guests.children > 1 ? 's' : ''}
            {reservation.guests.infants ? `, ${reservation.guests.infants} infant${reservation.guests.infants > 1 ? 's' : ''}` : ``}
          </section>

          <hr className={'my-2'}/>
          <section>
            <h2 className={'text-xl md:text-2xl'}>Travel Insurance</h2>
            <p>Protect against</p>
          </section>

          <hr className={'my-2'}/>
          <section>
            <h2>Trip Price</h2>
            <div className={'flex justify-between w-full'}>
              <span>${reservation?.listing.price} x {nights} nights</span>
              <span>${reservation?.listing.price * nights}</span>
            </div>

            { reservation?.listing.cleaning_fee &&
              <div className={'flex justify-between w-full mt-2'}>
                <span>Cleaning Fee</span>
                <span>${reservation?.listing.cleaning_fee}</span>
              </div>
            }

            { reservation?.listing.security_deposit &&
              <div className={'flex justify-between w-full mt-2'}>
                <span>Security Deposit</span>
                <span>${reservation?.listing.security_deposit}</span>
              </div>
            }

            { reservation.guests.adults + reservation.guests.children > reservation?.listing.guests_included ?
              <div className={'flex justify-between w-full mt-2'}>
                <span>Extra Guests</span>
                <span>${reservation?.listing.extra_people}</span>
              </div>
              : null
            }
          </section>
        </div>
      </div>
    </>
  )
}

export default Checkout