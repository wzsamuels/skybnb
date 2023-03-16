import '../styles/tailwind.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import apolloClient from '../lib/apollo'
import {useEffect, useState} from "react";
import {UserProvider} from "@auth0/nextjs-auth0/client";
import {ListProvider} from "../context/ListContext";

export default function App({ Component, pageProps }: AppProps) {
  const [reservation, setReservation] = useState({listing: null, guests: null, dates: null})

  useEffect(() => {
    const use = async () => {
      (await import('tw-elements')).default;
    };
    use();
  }, []);
  return (
    <UserProvider>
      <ApolloProvider client={apolloClient}>
        <div className={'text-dark bg-white min-h-[100vh] max-w-full relative '}>
          <div>
            <ListProvider>
              <Component {...pageProps} reservation={reservation} setReservation={setReservation}/>
            </ListProvider>
          </div>
        </div>
      </ApolloProvider>
    </UserProvider>
  )
}