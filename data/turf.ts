export type TurfAmenity = {
  label: string;
  icon: string;
};

export type Turf = {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: number; // price per hour
  location: string;

  // extra fields for a richer detail screen (still dummy/static)
  address: string;
  sports: Array<'Football' | 'Cricket'>;
  timeSlots: Array<'Evening' | 'Morning'>;
  isNearby: boolean;
  amenities: TurfAmenity[];
};

export const TURFS: Turf[] = [
  {
    id: 'turf-1',
    name: 'GreenGrid Arena',
    image:
      'https://images.unsplash.com/photo-1752005340528-76d01076bebd?q=80&w=2101&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.7,
    price: 45,
    location: 'Indiranagar',
    address: '12th Main, Near Metro Station, Indiranagar',
    sports: ['Football'],
    timeSlots: ['Evening', 'Morning'],
    isNearby: true,
    amenities: [
      { label: 'Floodlights', icon: 'sunny' },
      { label: 'Parking', icon: 'car' },
      { label: 'Changing Rooms', icon: 'shirt-outline' },
      { label: 'Drinking Water', icon: 'water' },
    ],
  },
  {
    id: 'turf-2',
    name: 'Cricket Corner Turf',
    image:
      'https://images.unsplash.com/photo-1713815713124-362af0201f3c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.5,
    price: 60,
    location: 'Koramangala',
    address: 'Opp. Sports Complex, Koramangala 5th Block',
    sports: ['Cricket'],
    timeSlots: ['Evening'],
    isNearby: false,
    amenities: [
      { label: 'Wickets', icon: 'git-branch' },
      { label: 'Practice Nets', icon: 'bowling-ball' },
      { label: 'Seating', icon: 'people' },
      { label: 'Restrooms', icon: 'man' },
    ],
  },
  {
    id: 'turf-3',
    name: 'Evening Elite Turf',
    image:
      'https://images.unsplash.com/photo-1653102740859-5ffca542310b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.8,
    price: 75,
    location: 'HSR Layout',
    address: 'Sector 2, HSR Layout, 100ft Road',
    sports: ['Football', 'Cricket'],
    timeSlots: ['Evening'],
    isNearby: true,
    amenities: [
      { label: 'Floodlights', icon: 'sunny' },
      { label: 'CCTV', icon: 'shield-checkmark' },
      { label: 'First Aid', icon: 'medical' },
      { label: 'Turf Lights', icon: 'flash' },
    ],
  },
  {
    id: 'turf-4',
    name: 'Neighborhood PlayField',
    image:
      'https://images.unsplash.com/photo-1698202770365-210c5f4480b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.3,
    price: 35,
    location: 'E-City',
    address: 'Near Community Park, Electronic City',
    sports: ['Football'],
    timeSlots: ['Morning'],
    isNearby: true,
    amenities: [
      { label: 'Parking', icon: 'car' },
      { label: 'Washrooms', icon: 'water' },
      { label: 'Seating', icon: 'people' },
      { label: 'Coach Support', icon: 'construct' },
    ],
  },
  {
    id: 'turf-5',
    name: 'Urban Cricket Lounge',
    image:
      'https://images.unsplash.com/photo-1710993115028-eaddbb9b3346?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.6,
    price: 55,
    location: 'Jayanagar',
    address: '3rd Block, Jayanagar, Opp. Heritage Club',
    sports: ['Cricket'],
    timeSlots: ['Evening', 'Morning'],
    isNearby: false,
    amenities: [
      { label: 'Bowling Lanes', icon: 'bowling-ball' },
      { label: 'Practice Nets', icon: 'git-branch' },
      { label: 'Parking', icon: 'car' },
      { label: 'Water Points', icon: 'water' },
    ],
  },
  {
    id: 'turf-6',
    name: 'Turf & Tempo Sports',
    image:
      'https://images.unsplash.com/photo-1710993115040-7b3d533e5b5c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.4,
    price: 50,
    location: 'Whitefield',
    address: 'Outer Ring Road, Whitefield',
    sports: ['Football', 'Cricket'],
    timeSlots: ['Evening'],
    isNearby: false,
    amenities: [
      { label: 'Floodlights', icon: 'sunny' },
      { label: 'Changing Rooms', icon: 'shirt-outline' },
      { label: 'Parking', icon: 'car' },
      { label: 'Safety', icon: 'shield-checkmark' },
    ],
  },
];
