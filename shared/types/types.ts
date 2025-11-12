export interface Folder {
    path: string
    type: 'folder'
    mtime: Date
    videos: Video[]
}
export interface Video {
    path: string
    size: number
    mtime: Date
}
