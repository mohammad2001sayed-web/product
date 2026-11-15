export interface BrandsResponse {
  results: number
  metadata: Metadata
  data: Brandarr[]
}

export interface Metadata {
  currentPage: number
  numberOfPages: number
  limit: number
  nextPage: number
}

export interface Brandarr {
  _id: string
  name: string
  slug: string
  image: string
  createdAt: string
  updatedAt: string
}
