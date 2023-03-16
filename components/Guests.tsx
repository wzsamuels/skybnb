import {AiOutlineMinus} from "react-icons/ai";
import {BiPlus} from "react-icons/bi";

const Guests = ({guests, setGuests, accommodates}) => {
  return (
    <>
      <div className={'flex justify-between mb-4'}>
        <div>
          <div>Adults</div>
          <div className={'text-sm'}>Age 13+</div>
        </div>
        <div className={'flex items-center'}>
          <button
            onClick={() => setGuests({...guests, adults: guests.adults -1})}
            disabled={guests.adults === 0}
            className={'rounded-full border border-black disabled:opacity-20 p-1'}><AiOutlineMinus className={'text-black'}/></button>
          <div className={'mx-2'}>{guests.adults}</div>
          <button
            onClick={() => setGuests({...guests, adults: guests.adults + 1})}
            disabled={guests.adults + guests.children === accommodates}
            className={'rounded-full border border-black disabled:opacity-20 p-1'}><BiPlus/></button>
        </div>
      </div>

    <div className={'flex justify-between mb-4'}>
      <div>
        <div>Children</div>
        <div className={'text-sm'}>Ages 2-12</div>
      </div>
      <div className={'flex items-center'}>
        <button
          onClick={() => setGuests({...guests, children: guests.children - 1})}
          disabled={guests.children === 0}
          className={'rounded-full border border-black disabled:opacity-20 p-1'}><AiOutlineMinus className={'text-black'}/></button>
        <div className={'mx-2'}>{guests.children}</div>
        <button
          onClick={() => setGuests({...guests, children: guests.children + 1})}
          disabled={guests.adults + guests.children === accommodates}
          className={'rounded-full border border-black disabled:opacity-20 p-1'}><BiPlus/></button>
      </div>
    </div>

    <div className={'flex justify-between mb-4'}>
      <div>
        <div>Infants</div>
        <div className={'text-sm'}>Under 2</div>
      </div>
      <div className={'flex items-center'}>
        <button
          onClick={() => setGuests({...guests, infants: guests.infants - 1})}
          disabled={guests.infants === 0}
          className={'rounded-full border border-black disabled:opacity-20 p-1'}><AiOutlineMinus className={'text-black'}/></button>
        <div className={'mx-2'}>{guests.infants}</div>
        <button
          onClick={() => setGuests({...guests, infants: guests.infants + 1})}
          disabled={guests.infants === 5}
          className={'rounded-full border border-black disabled:opacity-20 p-1'}><BiPlus/></button>
      </div>
    </div>

    <div className={'text-sm mb-4'}>
      This place has a maximum of {accommodates} guests, not including infants.
    </div>
    </>
  )
}

export default Guests