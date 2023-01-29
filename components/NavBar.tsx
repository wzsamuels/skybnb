import Link from "next/link";
import {ComponentPropsWithoutRef} from "react";
import AccountMenu from "./AccountMenu";
const NavBar = ({className, children} : ComponentPropsWithoutRef<"div">) => {

  return (
    <div className={`flex justify-between items-center px-4 shadow-lg ${className}`}>
      <Link href={'/'} className={'px-4 py-2 bg-primary text-light my-2 rounded-3xl'}>SkyBnB</Link>
      {children}
      <AccountMenu/>
    </div>
  )
}
export default NavBar