export interface FirebaseBookmark {
  title: string;
  url: URL | string;
  category: string;
  thumbnailUrl: URL | string;
  position?: number;
}
