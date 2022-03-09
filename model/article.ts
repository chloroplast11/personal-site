export interface Article{
  id: number,
  name: string,
  title: string,
  publishStatus?: number, // 2已发布 1未发布
  date?: string,
  abstract?: string,
  content?: string,
  tags?: string,
  tagList?: Array<{name: string, id: number}>
}