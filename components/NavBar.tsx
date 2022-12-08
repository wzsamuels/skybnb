import {IoMenuSharp} from "react-icons/io5";
import {MdAccountCircle} from "react-icons/md";
import {useUser} from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import {ComponentPropsWithoutRef} from "react";

const NavBar = ({className} : ComponentPropsWithoutRef<"div">) => {
  const {user} = useUser()

  return (
    <div className={`flex justify-between items-center px-4 ${className}`}>
      <Link href={'/'} className={'px-4 py-2 bg-primary text-light my-2 rounded-3xl'}>SkyBnB</Link>
      <button className={''}>

      </button>
      <div className="flex justify-center">
        <div>
          <div className="dropdown relative">
            <button
              className="flex h-8 px-1 items-center border border-dark rounded-3xl opacity-70 hover:opacity-100 hover:shadow-[0_0_5px_1px_#737774] focus:shadow-lg focus:outline-none focus:ring-0
           active:shadow-lg
          transition
          duration-150
          ease-in-out
          items-center
          whitespace-nowrap
        "
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <IoMenuSharp className={'w-6 h-6 mr-2'}/>
              <MdAccountCircle className={'w-6 h-6'}/>
            </button>
            <ul
              className="
          dropdown-menu min-w-max absolute bg-light hidden text-base z-50 float-left
          py-2 list-none ext-left
          rounded-lg
          drop-shadow-3xl
          shadow-[0_0_5px_1px_#737774]
          mt-1
          hidden
          m-0
          bg-clip-padding
          border-none
          overflow-y
        "
              aria-labelledby="dropdownMenuButton1"
            >
              <li>
                <a
                  className="
              dropdown-item
              text-sm
              py-2
              px-4
              font-normal
              block
              w-full
              whitespace-nowrap
              bg-transparent
              text-gray-700
              hover:bg-gray-200
            "
                  href="#"
                >Action</a
                >
              </li>
              <li>
                <a
                  className="
              dropdown-item
              text-sm
              py-2
              px-4
              font-normal
              block
              w-full
              whitespace-nowrap
              bg-transparent
              text-gray-700
              hover:bg-gray-200
            "
                  href="#"
                >Another action</a
                >
              </li>
              <li>
                <a
                  className="dropdown-item text-sm py-2
              px-4
              font-normal
              block
              w-full
              whitespace-nowrap bg-transparent
              text-gray-700               hover:bg-gray-200
            "
                  href="#"
                >Something else here</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar