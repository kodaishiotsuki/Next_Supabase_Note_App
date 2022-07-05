import { LogoutIcon } from '@heroicons/react/solid'
import { NextPage } from 'next'
import { Layout } from '../components/Layout'
import { supabase } from '../utils/supabase'

const Note: NextPage = () => {
  //サインアウトするための関数
  const signOut = () => {
    supabase.auth.signOut()
  }

  return (
    <Layout title="Note">
      <LogoutIcon
        onClick={signOut}
        className="mb-6 h-6 w-6 cursor-pointer text-blue-500"
      />
    </Layout>
  )
}
export default Note
