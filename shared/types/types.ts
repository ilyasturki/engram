export interface Folder {
    path: string
    type: 'folder'
    mtime: Date
    children: Video[]
}
export interface Video {
    path: string
    size: number
    mtime: Date
}
