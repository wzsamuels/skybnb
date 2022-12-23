import {IoMenuSharp} from "react-icons/io5";
import {MdAccountCircle} from "react-icons/md";
import Link from "next/link";
import {ComponentPropsWithoutRef} from "react";
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import AccountMenu from "./AccountMenu";
const NavBar = ({className} : ComponentPropsWithoutRef<"div">) => {

  return (
    <div className={`flex justify-between items-center px-4 ${className}`}>
      <Link href={'/'} className={'px-4 py-2 bg-primary text-light my-2 rounded-3xl'}>SkyBnB</Link>
      <AccountMenu/>
    </div>
  )
}
export default NavBar