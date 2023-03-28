import NavBar from "../components/NavBar";
import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import AccountMenu from "../components/AccountMenu";

/// TODO: Add functionality to edit guests and dates from the checkout page

const Checkout = ({reservation}) => {
  const [message, setMessage] = useState("");
  const [insurance, setInsurance] = useState(false);

  const nights = reservation?.dates?.endDate && reservation?.dates?.startDate ? reservation.dates.endDate.diff(reservation.dates.startDate, 'day') : null;

  const calcTotal = () => {
    let total = reservation?.listing?.price * nights ;
    if(reservation?.listing?.cleaning_fee) {
      total += reservation?.listing?.cleaning_fee;
    }
    if(reservation?.listing?.security_deposit) {
      total += reservation?.listing?.security_deposit;
    }
    if(reservation?.guests?.adults + reservation?.guests?.children > reservation?.listing?.guests_included) {
      total += reservation?.listing.extra_people;
    }
    if(insurance) {
      total += 49.99;
    }

    return total;
  }

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
              <p className={'font-bold'}>{reservation?.listing?.property_type}</p>
              <p className={'my-2 font-bold'}>{reservation?.listing?.bedrooms} bedrooms</p>
              <p>{reservation?.listing?.summary}</p>
            </div>
          </div>

          <hr className={'my-2'}/>
          <section className={'my-4'}>
            <h2 className={'text-xl md:text-2xl my-4'}>Trip Details</h2>
            <h3 className={'font-bold my-2'}>Dates</h3>
            <div>{reservation?.dates?.startDate.format('MMM D')} - {reservation?.dates?.endDate.format('MMM D')}</div>

            <h3 className={' font-bold my-2'}>Guests</h3>
            {reservation?.guests?.adults + reservation?.guests?.children} guest{reservation?.guests?.adults + reservation?.guests?.children > 1 ? 's' : ''}
            {reservation?.guests?.infants ? `, ${reservation?.guests?.infants} infant${reservation?.guests?.infants > 1 ? 's' : ''}` : ``}
          </section>

          <hr className={'my-2'}/>
          <section>
            <h2 className={'text-xl md:text-2xl my-4'}>Travel Insurance</h2>
            <p className={'my-4'}>Protect against the unexpected. Add peace of mind to your trip.</p>
            <div className={'flex items-center'}>
              <input type={'checkbox'} className={'rounded mr-2'} checked={insurance} onChange={() => setInsurance(state => !state)}/>
              <label>Add Travel Insurance for $49.99</label>
            </div>
          </section>

          <hr className={'my-2'}/>
          <section className={''}>
            <h2 className={'text-xl md:text-2xl my-4'}>Trip Price</h2>
            <div className={'flex justify-between w-full my-2'}>
              <span>${reservation?.listing?.price} per night x {nights} nights</span>
              <span>${reservation?.listing?.price * nights}</span>
            </div>

            { reservation?.listing?.cleaning_fee &&
              <div className={'flex justify-between w-full my-2'}>
                <span>Cleaning Fee</span>
                <span>${reservation?.listing?.cleaning_fee}</span>
              </div>
            }

            { reservation?.listing?.security_deposit &&
              <div className={'flex justify-between w-full my-2'}>
                <span>Security Deposit</span>
                <span>${reservation?.listing?.security_deposit}</span>
              </div>
            }

            { reservation?.guests?.adults + reservation?.guests?.children > reservation?.listing?.guests_included ?
              <div className={'flex justify-between w-full my-2'}>
                <span>Extra Guests</span>
                <span>${reservation?.listing.extra_people}</span>
              </div>
              : null
            }

            { insurance &&
              <div className={'flex justify-between w-full my-2'}>
                <span>Travel Insurance</span>
                <span>$49.99</span>
              </div>
            }
            <div className={'flex justify-between w-full mt-2'}>
              <span>Total: </span>
              <span>${calcTotal()}</span>
            </div>
          </section>
          <hr className={'my-2'}/>
          <section className={'my-4 flex justify-center'}>
            <button onClick={() => setMessage("You reservation has been confirmed. Enjoy your trip!")} className={'px-4 py-2 bg-red-600 rounded-xl text-white'}>Confirm Reservation</button>
          </section>
          <section className={'w-full flex justify-center'}>
            {
              message &&
              <div className={'text-center rounded-xl border border-red-600 p-6 max-w-2xl w-full'}>
                {message}
              </div>
            }
          </section>
        </div>
      </div>
    </>
  )
}

export default Checkout