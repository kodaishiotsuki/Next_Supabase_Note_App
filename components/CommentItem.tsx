import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import { FC, useEffect, useState } from 'react'
import { useMutateComment } from '../hooks/useMutateComment'
import useStore from '../store'
import { Comment } from '../types/types'
import { supabase } from '../utils/supabase'
import { Spinner } from './Spinner'

export const CommentItem: FC<Omit<Comment, 'created_at' | 'note_id'>> = ({
  id,
  content,
  user_id,
}) => {
  //現在のuserIdを格納するstate
  const [userId, setUserId] = useState<string | undefined>('')
  //更新用の関数読み込み
  const update = useStore((state) => state.updateEditedComment)
  //カスタムフックから削除を読み込み
  const { deleteCommentMutation } = useMutateComment()

  //supabaseのユーザーをuserIdに格納
  useEffect(() => {
    setUserId(supabase.auth.user()?.id)
  }, [])

  //スピナー表示
  if (deleteCommentMutation.isLoading) {
    return <Spinner />
  }

  return (
    <li className="my-3">
      <span>{content}</span>
      {userId === user_id && (
        <div className="float-right ml-20 flex">
          <PencilAltIcon
            className="mx-1 h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => {
              update({
                id: id,
                content: content,
              })
            }}
          />
          <TrashIcon
            className="h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => {
              deleteCommentMutation.mutate(id)
            }}
          />
        </div>
      )}
    </li>
  )
}
