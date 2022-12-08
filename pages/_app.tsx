import '../styles/tailwind.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import apolloClient from '../lib/apollo'
import {UserProvider} from "@auth0/nextjs-auth0/client";
import {useEffect} from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const use = async () => {
      (await import('tw-elements')).default;
    };
    use();
  }, []);
  return (
    <UserProvider>
      <ApolloProvider client={apolloClient}>
        <div className={'text-dark bg-light min-h-[100vh] max-w-full relative '}>
          <Component {...pageProps} />
        </div>
      </ApolloProvider>
    </UserProvider>
  )
}