import { FC, FormEvent } from 'react'
import { useMutateNote } from '../hooks/useMutateNote'
import useStore from '../store'
import { supabase } from '../utils/supabase'
import { Spinner } from './Spinner'

export const NoteForm: FC = () => {
  //zustandからeditedNoteのstateを取得
  const { editedNote } = useStore()
  //更新用の関数読み込み
  const update = useStore((state) => state.updateEditedNote)
  //カスタムフックから新規登録と更新を読み込み
  const { createNoteMutation, updateNoteMutation } = useMutateNote()

  //クリックイベント
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    //新規登録
    if (editedNote.id === '') {
      createNoteMutation.mutate({
        title: editedNote.title,
        content: editedNote.content,
        user_id: supabase.auth.user()?.id,
      })
      //更新
    } else {
      updateNoteMutation.mutate({
        id: editedNote.id,
        title: editedNote.title,
        content: editedNote.content,
      })
    }
  }

  //スピナー表示
  if (updateNoteMutation.isLoading || createNoteMutation.isLoading) {
    return <Spinner />
  }

  return (
    <form onSubmit={submitHandler}>
      <div>
        <input
          className="my-2 rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
          type="text"
          placeholder="title"
          value={editedNote.title}
          onChange={(e) => update({ ...editedNote, title: e.target.value })}
        />
      </div>
      <div>
        <textarea
          className="my-2 rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
          cols={50}
          rows={10}
          placeholder="content"
          value={editedNote.content}
          onChange={(e) => {
            update({ ...editedNote, content: e.target.value })
          }}
        />
      </div>
      <button
        type="submit"
        className="ml-2 bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        {editedNote.id ? 'Update' : 'Create'}
      </button>
    </form>
  )
}
