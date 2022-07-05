import { useMutation } from 'react-query'
import useStore from '../store'
import { Note, EditedNote } from '../types/types'
import { supabase } from '../utils/supabase'
import { revalidateList, revalidateSingle } from '../utils/revalidation'

//カスタムフック作成
export const useMutateNote = () => {
  const reset = useStore((state) => state.resetEditedNote)

  //noteの新規作成
  const createNoteMutation = useMutation(
    async (note: Omit<Note, 'created_at' | 'user_id' | 'comments'>) => {
      const { data, error } = await supabase.from('notes').insert(note)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: () => {
        revalidateList() //pages/api/revalidate/index.tsの処理が実行(noteページが再生成)
        reset() //初期化
        alert('Successfully completed!!')
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  //noteの更新
  const updateNoteMutation = useMutation(
    async (note: EditedNote) => {
      const { data, error } = await supabase
        .from('notes')
        .update({ title: note.title, content: note.content })
        .eq('id', note.id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        revalidateList() //pages/api/revalidate/index.tsの処理が実行(noteページが再生成)
        revalidateSingle(res[0].id) //詳細ページも更新
        reset() //初期化
        alert('Successfully completed!!')
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  //noteの削除
  const deleteNoteMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase.from('notes').delete().eq('id', id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: () => {
        revalidateList() //pages/api/revalidate/index.tsの処理が実行(noteページが再生成)
        reset() //初期化
        alert('Successfully completed!!')
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  return { deleteNoteMutation, createNoteMutation, updateNoteMutation }
}
