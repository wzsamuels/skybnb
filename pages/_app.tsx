import '../styles/tailwind.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import apolloClient from '../lib/apollo'
import {useEffect} from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const use = async () => {
      (await import('tw-elements')).default;
    };
    use();
  }, []);
  return (
      <ApolloProvider client={apolloClient}>
        <div className={'text-dark bg-white min-h-[100vh] max-w-full relative '}>
          <div>
            <Component {...pageProps} />
          </div>
        </div>
      </ApolloProvider>
  )
}