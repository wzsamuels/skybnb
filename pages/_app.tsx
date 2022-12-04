import '../styles/tailwind.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import apolloClient from '../lib/apollo'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <div className={'text-dark bg-light min-h-[100vh] max-w-full relative '}>
        <Component {...pageProps} />
      </div>
    </ApolloProvider>
  )
}