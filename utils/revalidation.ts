//pages/api/revalidate/index.tsのエンドポイントにフェッチを行う
export const revalidateList = () => {
  fetch('/api/revalidate')
}
//pages/api/revalidate/[id].tsxのエンドポイントにフェッチを行う
export const revalidateSingle = (id: string) => {
  fetch(`/api/revalidate/${id}`)
}
