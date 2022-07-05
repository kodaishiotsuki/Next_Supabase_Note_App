import create from 'zustand' //状態管理
import { EditedComment, EditedNote } from './types/types'

type State = {
  editedNote: EditedNote
  editedComment: EditedComment
  //stateの更新
  updateEditedNote: (payload: EditedNote) => void
  updateEditedComment: (payload: EditedComment) => void
  //stateのリセット
  resetEditedNote: () => void
  resetEditedComment: () => void
}

const useStore = create<State>((set, _) => ({
  editedNote: { id: '', title: '', content: '' },
  editedComment: { id: '', content: '' },
  updateEditedNote: (payload) =>
    set({
      editedNote: {
        id: payload.id,
        title: payload.title,
        content: payload.content,
      },
    }),
  resetEditedNote: () =>
    set({ editedNote: { id: '', title: '', content: '' } }),
  updateEditedComment: (payload) =>
    set({
      editedComment: {
        id: payload.id,
        content: payload.content,
      },
    }),
  resetEditedComment: () => set({ editedComment: { id: '', content: '' } }),
}))

export default useStore
