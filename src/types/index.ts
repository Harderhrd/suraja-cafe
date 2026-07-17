export interface MenuItem {
  id: string;
  title: string;
  description: string;
  image: string;
  items: string[];
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

export interface ContactFormState {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
}
