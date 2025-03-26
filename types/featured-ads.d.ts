export interface FeaturedAd {
  id: number;
  title: string;
  price: string;
  location: string;
  category: string;
  image: string;
  slug: string;
}

export interface FeaturedAdsProps {
  ads?: FeaturedAd[];
}
