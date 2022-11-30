import '../styles/tailwind.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import apolloClient from '../lib/apollo'
import Layout from "../components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  )
}