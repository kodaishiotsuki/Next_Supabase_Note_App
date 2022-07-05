import { DocumentTextIcon, LogoutIcon } from '@heroicons/react/solid'
import { GetStaticProps, NextPage } from 'next'
import { Layout } from '../components/Layout'
import { NoteForm } from '../components/NoteForm'
import { NoteItem } from '../components/NoteItem'
import { Note } from '../types/types'
import { supabase } from '../utils/supabase'

//supabaseから取得(ISRで動的に再生成するため)
export const getStaticProps: GetStaticProps = async () => {
  console.log('ISR invoked - notes page')
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) {
    throw new Error(`${error.message}: ${error.details}`)
  }
  return {
    props: { notes },
    revalidate: false, //オンデマンドISR
  }
}

//propsの型を指定
type StaticProps = {
  notes: Note[]
}

const Note: NextPage<StaticProps> = ({ notes }) => {
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
      <DocumentTextIcon className="h-8 w-8 text-blue-500" />
      <ul className="my-2">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            user_id={note.user_id}
          />
        ))}
      </ul>
      <NoteForm />
    </Layout>
  )
}
export default Note
