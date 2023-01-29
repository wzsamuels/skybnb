import {Menu, Transition} from "@headlessui/react";
import {IoMenuSharp} from "react-icons/io5";
import {MdAccountCircle} from "react-icons/md";
import {Fragment, useState} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import Modal from "./Modal";

const AccountMenu = () => {
  const { user } = useUser();
  console.log(user ? user : "no user");

  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="flex h-8 px-1 items-center border border-dark rounded-3xl opacity-70 hover:opacity-100 hover:shadow-[0_0_5px_1px_#737774] focus:shadow-lg focus:outline-none focus:ring-0
          active:shadow-lg
          transition
          duration-150
          ease-in-out
          items-center
          whitespace-nowrap">
            <IoMenuSharp className={'w-6 h-6 mr-2'}/>
            <MdAccountCircle className={'w-6 h-6'}/>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-50 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            { user ?
              <div className="px-1 py-1 ">
                <Menu.Item>
                  <Link
                    href={'/wishlist'}
                    className={`group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Wishlist
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={'/api/auth/logout'}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      Log Out
                    </Link>
                  )}
                </Menu.Item>
              </div>
              :
              <div className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={'/api/auth/login'}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      Login
                    </Link>
                  )}
                </Menu.Item>
              </div>
            }

          </Menu.Items>
        </Transition>
      </Menu>
      <Modal show={showLoginModal} onClose={() => setShowLoginModal(false)} title={"Login"}>
        <iframe src={'/api/auth/login'}/>
      </Modal>
    </>
  )
}



export default AccountMenu