export interface Folder {
    path: string
    type: 'folder'
    mtime: string
    videos: Video[]
}
export interface Video {
    path: string
    size: number
    mtime: string
}
