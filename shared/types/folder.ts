export interface FolderItem {
  name: string
  path: string
  type: 'file' | 'folder'
  size?: number
  mimeType?: string
  children?: FolderItem[]
}

export interface FolderStructure {
  items: FolderItem[]
}
