export interface Folder {
    type: 'folder'
    path: string
    mtime: string
    videos: Video[]
}
export interface Video {
    type: 'video'
    path: string
    size: number
    mtime: string
}
