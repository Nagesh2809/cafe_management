import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Irani Chai',
    category: 'Chai',
    price: 30,
    description: 'Our signature strong tea brewed with creamy milk and secret spices.',
    longDescription: 'The soul of Hyderabad. A robust blend of premium dust tea dust, boiled for hours with creamy milk and a hint of secret spices to give you that authentic kick. Served piping hot.',
    ingredients: ['Assam Tea Dust', 'Full Cream Buffalo Milk', 'Sugar', 'Secret Spice Blend', 'Water'],
    image: 'https://images.unsplash.com/photo-1626818599456-5c93540d9d4f?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 1240,
    addOns: [
        { name: 'Extra Milk', price: 10, type: 'toggle' },
        { name: 'Less Sugar', price: 0, type: 'toggle' },
        { name: 'Sugar Free', price: 5, type: 'toggle' },
        { name: 'Extra Cardamom', price: 5, type: 'toggle' }
    ]
  },
  {
    id: '2',
    name: 'Osmania Biscuits',
    category: 'Bakery',
    price: 150,
    description: 'The legendary salt-sweet biscuits that melt in your mouth.',
    longDescription: 'Named after the last Nizam of Hyderabad, these biscuits are the perfect balance of sweet and salty. Baked to golden perfection with a rich buttery texture that crumbles delightfully.',
    ingredients: ['Refined Flour (Maida)', 'Butter', 'Sugar', 'Salt', 'Milk Solids', 'Custard Powder', 'Cardamom'],
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 850,
    addOns: [
        { name: 'Extra Butter Dip', price: 10, type: 'toggle' },
        { name: 'Gift Box Packaging', price: 30, type: 'toggle' }
    ]
  },
  {
    id: '3',
    name: 'Bun Maska',
    category: 'Bakery',
    price: 45,
    description: 'Soft sweet bun slathered with generous homemade butter.',
    longDescription: 'A breakfast staple. Freshly baked sweet buns sliced and loaded with a generous slab of salty homemade butter (maska). Best enjoyed by dipping into hot Irani Chai.',
    ingredients: ['Refined Flour', 'Yeast', 'Sugar', 'Salt', 'Butter (Maska)', 'Milk'],
    image: 'https://images.unsplash.com/photo-1606456070389-c48c3e80034b?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
    isAvailable: true,
    rating: 4.7,
    addOns: [
        { name: 'Extra Butter (Maska)', price: 15, type: 'quantity', maxQuantity: 2 },
        { name: 'Extra Bun', price: 35, type: 'quantity', maxQuantity: 2 },
        { name: 'Cheese Slice', price: 25, type: 'quantity', maxQuantity: 2 },
        { name: 'Fruit Jam', price: 10, type: 'toggle' }
    ]
  },
  {
    id: '4',
    name: 'Malai Bun',
    category: 'Bakery',
    price: 60,
    description: 'Fresh bun topped with thick, fresh cream (Malai) and sugar.',
    longDescription: 'Indulgence on a plate. We take the thickest layer of clotted cream (Malai) and spread it over a soft bun with a sprinkling of sugar. A creamy, sweet delight.',
    ingredients: ['Refined Flour', 'Fresh Cream (Malai)', 'Sugar', 'Milk'],
    image: 'https://images.unsplash.com/photo-1560155016-bd4879ae8f21?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
    isAvailable: true,
    rating: 4.9,
    addOns: [
        { name: 'Extra Malai', price: 20, type: 'quantity', maxQuantity: 2 },
        { name: 'Extra Bun', price: 40, type: 'quantity', maxQuantity: 2 },
        { name: 'Honey Drizzle', price: 15, type: 'toggle' }
    ]
  },
  {
    id: '5',
    name: 'Veg Samosa (Onion)',
    category: 'Snacks',
    price: 25,
    description: 'Crispy pastry filled with spicy onion masala.',
    ingredients: ['Maida', 'Onion', 'Green Chillies', 'Spices', 'Oil'],
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    rating: 4.5,
    addOns: [
        { name: 'Mint Chutney', price: 10, type: 'toggle' },
        { name: 'Sweet Chutney', price: 10, type: 'toggle' },
        { name: 'Extra Pav', price: 10, type: 'quantity', maxQuantity: 4 }
    ]
  },
  {
    id: '6',
    name: 'Chicken Puff',
    category: 'Snacks',
    price: 50,
    description: 'Flaky puff pastry stuffed with spicy chicken kheema.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    rating: 4.6,
    addOns: [
        { name: 'Tomato Ketchup', price: 0, type: 'toggle' },
        { name: 'Mayonnaise', price: 10, type: 'toggle' }
    ]
  },
  {
    id: '7',
    name: 'Cold Coffee',
    category: 'Beverages',
    price: 90,
    description: 'Creamy blended coffee to beat the Hyderabad heat.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    rating: 4.4,
    addOns: [
        { name: 'Extra Shot Espresso', price: 30, type: 'toggle' },
        { name: 'Ice Cream Scoop', price: 40, type: 'toggle' },
        { name: 'Chocolate Sauce', price: 10, type: 'toggle' }
    ]
  },
  {
    id: '8',
    name: 'Zafrani Tea',
    category: 'Chai',
    price: 50,
    description: 'Premium Irani chai infused with rich saffron strands.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231847233?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    rating: 4.8
  },
  {
    id: '9',
    name: 'Fine Biscuits',
    category: 'Bakery',
    price: 180,
    description: 'Crispy, multi-layered biscuits sprinkled with sugar.',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    rating: 4.3
  },
  {
    id: '10',
    name: 'Double Ka Meetha',
    category: 'Snacks',
    price: 120,
    description: 'Hyderabadi bread pudding soaked in saffron milk and nuts.',
    image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800&auto=format&fit=crop',
    isAvailable: false,
    rating: 4.9
  }
];