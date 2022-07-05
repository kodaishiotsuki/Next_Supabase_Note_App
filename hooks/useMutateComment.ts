import { useMutation } from 'react-query'
import useStore from '../store'
import { Comment, EditedComment } from '../types/types'
import { supabase } from '../utils/supabase'
import { revalidateSingle } from '../utils/revalidation'

//カスタムフック作成
export const useMutateComment = () => {
  const reset = useStore((state) => state.resetEditedComment)

  //commentの新規作成
  const createCommentMutation = useMutation(
    async (comment: Omit<Comment, 'created_at' | 'id'>) => {
      const { data, error } = await supabase.from('comments').insert(comment)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        revalidateSingle(res[0].note_id) //個別ページのみ再生成
        reset() //初期化
        alert('Successfully completed!!')
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  //commentの更新
  const updateCommentMutation = useMutation(
    async (comment: EditedComment) => {
      const { data, error } = await supabase
        .from('comments')
        .update({ content: comment.content })
        .eq('id', comment.id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        revalidateSingle(res[0].note_id)
        reset() //初期化
        alert('Successfully completed!!')
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  //commentの削除
  const deleteCommentMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        revalidateSingle(res[0].note_id)
        reset() //初期化
        alert('Successfully completed!!')
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  return { deleteCommentMutation, createCommentMutation, updateCommentMutation }
}
