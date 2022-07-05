import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { useMutateNote } from '../hooks/useMutateNote'
import useStore from '../store'
import { Note } from '../types/types'
import { supabase } from '../utils/supabase'
import { Spinner } from './Spinner'

export const NoteItem: FC<
  Omit<Note, 'created_at' | 'note_id' | 'comments'>
> = ({ id, title, content, user_id }) => {
  //現在のuserIdを格納するstate
  const [userId, setUserId] = useState<string | undefined>('')
  //更新用の関数読み込み
  const update = useStore((state) => state.updateEditedNote)
  //カスタムフックから削除を読み込み
  const { deleteNoteMutation } = useMutateNote()

  useEffect(() => {
    setUserId(supabase.auth.user()?.id)
  }, [])

  //スピナー表示
  if (deleteNoteMutation.isLoading) {
    return <Spinner />
  }
  return (
    <li className="my-3">
      {/* prefetch={false}→ホバリング時のみ有効 */}
      <Link href={`/note/${id}`} prefetch={false}>
        <a className="cursor-pointer hover:text-pink-600">{title}</a>
      </Link>
      {userId === user_id && (
        <div className="float-right ml-20 flex">
          <PencilAltIcon
            className="mx-1 h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => {
              update({
                id: id,
                title: title,
                content: content,
              })
            }}
          />
          <TrashIcon
            className="h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => {
              deleteNoteMutation.mutate(id)
            }}
          />
        </div>
      )}
    </li>
  )
}
