import {ComponentPropsWithoutRef, ReactNode} from "react";

interface Props extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
}
const Layout = ({children, className, ...rest} : Props)  => {
  return (
    <div className={className} {...rest}>
      <nav className={'h-[50px] border-b-2 border-gray-400'}>
        <button>Filter</button>
      </nav>
      <main>
        {children}
      </main>
      <footer className={'border-gray-400 border-t-2'}>
        SkyBnB
      </footer>
    </div>
  )
}

export default Layout