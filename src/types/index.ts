export interface Link {
  id: string;
  title: string;
  url: string;
  order: number;
}

export interface UserPage {
  username: string;
  profilePicture: string;
  bio: string;
  links: Link[];
  listedBy?: string | null;
  theme?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface UsersData {
  [username: string]: UserPage;
}

