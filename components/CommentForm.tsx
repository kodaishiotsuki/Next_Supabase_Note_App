import { FC, FormEvent } from 'react'
import { useMutateComment } from '../hooks/useMutateComment'
import useStore from '../store'
import { supabase } from '../utils/supabase'
import { Spinner } from './Spinner'

export const CommentForm: FC<{ noteId: string }> = ({ noteId }) => {
  //zustandからeditedCommentのstateを取得
  const { editedComment } = useStore()
  //更新用の関数読み込み
  const update = useStore((state) => state.updateEditedComment)
  //カスタムフックから新規登録と更新を読み込み
  const { createCommentMutation, updateCommentMutation } = useMutateComment()

  //クリックイベント
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    //新規登録
    if (editedComment.id === '') {
      createCommentMutation.mutate({
        content: editedComment.content,
        user_id: supabase.auth.user()?.id,
        note_id: noteId,
      })
      //更新
    } else {
      updateCommentMutation.mutate({
        id: editedComment.id,
        content: editedComment.content,
      })
    }
  }

  //スピナー表示
  if (updateCommentMutation.isLoading || createCommentMutation.isLoading) {
    return <Spinner />
  }

  return (
    <form onSubmit={submitHandler}>
      <input
        className="my-2 rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
        type="text"
        placeholder="comment"
        value={editedComment.content}
        onChange={(e) => update({ ...editedComment, content: e.target.value })}
      />
      <button
        type="submit"
        className="ml-2 bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        {editedComment.id ? 'Update' : 'Send'}
      </button>
    </form>
  )
}
