import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { supabase } from '../utils/supabase'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

//クライアント作成
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  const { push, pathname } = useRouter()

  //バリデーション設定
  const validateSession = async () => {
    const user = supabase.auth.user()
    if (user && pathname === '/') {
      push('/note')
    } else if (!user && pathname !== '/') {
      push('/')
    }
  }

  //ユーザーのセッションを監視する関数
  supabase.auth.onAuthStateChange((event, _) => {
    if (event === 'SIGNED_IN' && pathname === '/') {
      push('/note')
    }
    if (event === 'SIGNED_OUT') {
      push('/')
    }
  })

  //バリデーションが確実に実行されるように
  useEffect(() => {
    validateSession()
  }, [])


  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

export default MyApp
