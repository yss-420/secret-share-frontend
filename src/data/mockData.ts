export interface Character {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
  isLocked: boolean;
  category: string;
}

export interface GemPackage {
  id: string;
  name: string;
  gems: number;
  price: number;
  isPopular?: boolean;
  bonus?: string;
}

export interface User {
  energy: number;
  gems: number;
  level: number;
  experience: number;
}

export const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Luna',
    description: 'A mysterious and enchanting companion who loves deep conversations under the starlight.',
    points: 15420,
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=600&fit=crop',
    isLocked: false,
    category: 'Fantasy'
  },
  {
    id: '2',
    name: 'Aria',
    description: 'A playful and energetic companion who brings joy and laughter to every interaction.',
    points: 12850,
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=600&fit=crop',
    isLocked: false,
    category: 'Cheerful'
  },
  {
    id: '3',
    name: 'Sage',
    description: 'A wise and thoughtful companion who offers guidance and philosophical discussions.',
    points: 9340,
    image: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=600&fit=crop',
    isLocked: false,
    category: 'Wise'
  },
  {
    id: '4',
    name: 'Nova',
    description: 'A futuristic companion with advanced knowledge and cutting-edge conversations.',
    points: 8750,
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=600&fit=crop',
    isLocked: true,
    category: 'Sci-Fi'
  },
  {
    id: '5',
    name: 'Echo',
    description: 'A mysterious companion who understands your deepest thoughts and emotions.',
    points: 7920,
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=600&fit=crop',
    isLocked: true,
    category: 'Mysterious'
  },
  {
    id: '6',
    name: 'Zara',
    description: 'An adventurous companion ready to explore new worlds and experiences with you.',
    points: 6540,
    image: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=600&fit=crop',
    isLocked: true,
    category: 'Adventure'
  }
];

export const mockGemPackages: GemPackage[] = [
  {
    id: '1',
    name: 'Starter Pack',
    gems: 100,
    price: 0.99
  },
  {
    id: '2',
    name: 'Popular Pack',
    gems: 500,
    price: 4.99,
    isPopular: true,
    bonus: '+50 Bonus Gems'
  },
  {
    id: '3',
    name: 'Value Pack',
    gems: 1000,
    price: 9.99,
    bonus: '+150 Bonus Gems'
  },
  {
    id: '4',
    name: 'Premium Pack',
    gems: 2500,
    price: 19.99,
    bonus: '+500 Bonus Gems'
  },
  {
    id: '5',
    name: 'Ultimate Pack',
    gems: 5000,
    price: 39.99,
    bonus: '+1000 Bonus Gems'
  },
  {
    id: '6',
    name: 'Legendary Pack',
    gems: 10000,
    price: 69.99,
    bonus: '+2500 Bonus Gems'
  }
];

export const mockUser: User = {
  energy: 85,
  gems: 1250,
  level: 12,
  experience: 2340
};