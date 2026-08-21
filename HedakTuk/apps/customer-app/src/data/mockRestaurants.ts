// Realistic mock restaurant data for development
// Each restaurant has full details + menu

export interface MockMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  isBestseller?: boolean;
}

export interface MockMenuCategory {
  id: string;
  name: string;
  items: MockMenuItem[];
}

export interface MockRestaurant {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  logoUrl: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  totalRatings: number;
  cuisines: string[];
  avgDeliveryTimeMinutes: number;
  minOrderAmount: number;
  deliveryFee: number;
  isOpen: boolean;
  distance: string;
  promoted?: boolean;
  menu: MockMenuCategory[];
}

export const CUISINE_CATEGORIES = [
  { id: 'all', label: 'All', emoji: '🍽️' },
  { id: 'biryani', label: 'Biryani', emoji: '🍛' },
  { id: 'pizza', label: 'Pizza', emoji: '🍕' },
  { id: 'burger', label: 'Burgers', emoji: '🍔' },
  { id: 'chinese', label: 'Chinese', emoji: '🥡' },
  { id: 'south-indian', label: 'South Indian', emoji: '🫓' },
  { id: 'north-indian', label: 'North Indian', emoji: '🍲' },
  { id: 'dessert', label: 'Desserts', emoji: '🍰' },
  { id: 'healthy', label: 'Healthy', emoji: '🥗' },
  { id: 'cafe', label: 'Café', emoji: '☕' },
];

export const BANNERS = [
  { id: '1', title: '60% OFF', subtitle: 'Up to ₹120 on first order', color: '#FF6B6B', emoji: '🎉' },
  { id: '2', title: 'FREE DELIVERY', subtitle: 'On orders above ₹199', color: '#00D9A6', emoji: '🛵' },
  { id: '3', title: 'TRY NEW', subtitle: 'Discover trending restaurants', color: '#6C9FFF', emoji: '🔥' },
];

const IMG = 'https://images.unsplash.com/photo-';

export const mockRestaurants: MockRestaurant[] = [
  {
    id: 'r1',
    name: 'Bombay Biryani House',
    description: 'Authentic Hyderabadi dum biryani made with aged basmati rice and traditional spices. Serving since 1998.',
    coverImageUrl: `${IMG}1631515243349-e0cb75fb8d3a?w=800&h=400&fit=crop`,
    logoUrl: `${IMG}1631515243349-e0cb75fb8d3a?w=100&h=100&fit=crop`,
    address: '45 MG Road, Koramangala',
    latitude: 12.9352,
    longitude: 77.6245,
    rating: 4.5,
    totalRatings: 2847,
    cuisines: ['Biryani', 'North Indian', 'Mughlai'],
    avgDeliveryTimeMinutes: 35,
    minOrderAmount: 149,
    deliveryFee: 25,
    isOpen: true,
    distance: '2.1 km',
    promoted: true,
    menu: [
      {
        id: 'mc1', name: 'Bestseller Biryanis', items: [
          { id: 'm1', name: 'Hyderabadi Chicken Dum Biryani', description: 'Slow-cooked with saffron, mint and aromatic spices. Served with raita & salan.', price: 299, imageUrl: `${IMG}1563379091339-03b21ab4a4f4?w=300&h=200&fit=crop`, isVeg: false, isAvailable: true, preparationTimeMinutes: 25, isBestseller: true },
          { id: 'm2', name: 'Mutton Biryani', description: 'Tender goat meat layered with basmati rice, garnished with fried onions.', price: 399, imageUrl: `${IMG}1642821373181-696a54913e93?w=300&h=200&fit=crop`, isVeg: false, isAvailable: true, preparationTimeMinutes: 30, isBestseller: true },
          { id: 'm3', name: 'Veg Dum Biryani', description: 'Garden fresh vegetables in aromatic basmati with paneer cubes.', price: 219, imageUrl: `${IMG}1596797038530-2c107229654b?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 20 },
        ]
      },
      {
        id: 'mc2', name: 'Starters', items: [
          { id: 'm4', name: 'Chicken 65', description: 'Crispy fried chicken tossed in spicy masala with curry leaves.', price: 249, imageUrl: `${IMG}1610057099443-fde6c3d97fb3?w=300&h=200&fit=crop`, isVeg: false, isAvailable: true, preparationTimeMinutes: 15 },
          { id: 'm5', name: 'Paneer Tikka', description: 'Marinated cottage cheese grilled in tandoor with peppers.', price: 229, imageUrl: `${IMG}1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 15 },
        ]
      },
      {
        id: 'mc3', name: 'Breads & Sides', items: [
          { id: 'm6', name: 'Butter Naan', description: 'Soft leavened bread brushed with butter.', price: 49, imageUrl: `${IMG}1600498148212-a27e0207a06e?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 8 },
          { id: 'm7', name: 'Mirchi Ka Salan', description: 'Tangy chili-peanut gravy, the classic biryani companion.', price: 99, imageUrl: `${IMG}1505253716362-afaea1d3d1af?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 5 },
        ]
      },
    ],
  },
  {
    id: 'r2',
    name: 'Pizza Planet',
    description: 'New York style pizzas with hand-tossed dough and imported mozzarella. Wood-fired perfection.',
    coverImageUrl: `${IMG}1513104890138-7c749659a591?w=800&h=400&fit=crop`,
    logoUrl: `${IMG}1513104890138-7c749659a591?w=100&h=100&fit=crop`,
    address: '12 Brigade Road, Indiranagar',
    latitude: 12.9716,
    longitude: 77.6413,
    rating: 4.3,
    totalRatings: 1956,
    cuisines: ['Pizza', 'Italian', 'Pasta'],
    avgDeliveryTimeMinutes: 30,
    minOrderAmount: 199,
    deliveryFee: 30,
    isOpen: true,
    distance: '1.5 km',
    menu: [
      {
        id: 'mc4', name: 'Signature Pizzas', items: [
          { id: 'm8', name: 'Margherita Classica', description: 'San Marzano tomato sauce, fresh mozzarella, basil, olive oil.', price: 349, imageUrl: `${IMG}1574071318508-1cdbab80d002?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 20, isBestseller: true },
          { id: 'm9', name: 'BBQ Chicken Supreme', description: 'Smoky BBQ sauce, grilled chicken, onions, jalapeños, extra cheese.', price: 449, imageUrl: `${IMG}1565299624946-b28f40a0ae38?w=300&h=200&fit=crop`, isVeg: false, isAvailable: true, preparationTimeMinutes: 22, isBestseller: true },
          { id: 'm10', name: 'Farm Fresh Veggie', description: 'Bell peppers, olives, mushrooms, corn, onions on white sauce.', price: 379, imageUrl: `${IMG}1571407970349-bc81e7e96d47?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 20 },
        ]
      },
      {
        id: 'mc5', name: 'Pasta', items: [
          { id: 'm11', name: 'Penne Arrabbiata', description: 'Spicy tomato sauce with garlic and red chili flakes.', price: 279, imageUrl: `${IMG}1563379926898-05f4575a45d8?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 15 },
          { id: 'm12', name: 'Chicken Alfredo', description: 'Creamy parmesan sauce with grilled chicken and fettuccine.', price: 329, imageUrl: `${IMG}1645112411341-6c4e2f4c5a5e?w=300&h=200&fit=crop`, isVeg: false, isAvailable: true, preparationTimeMinutes: 18 },
        ]
      },
    ],
  },
  {
    id: 'r3',
    name: 'Dragon Wok',
    description: 'Authentic Sichuan and Indo-Chinese cuisine. Flaming wok, bold flavors.',
    coverImageUrl: `${IMG}1552611052-d093684e3174?w=800&h=400&fit=crop`,
    logoUrl: `${IMG}1552611052-d093684e3174?w=100&h=100&fit=crop`,
    address: '78 HSR Layout, Sector 3',
    latitude: 12.9121,
    longitude: 77.6446,
    rating: 4.1,
    totalRatings: 1234,
    cuisines: ['Chinese', 'Asian', 'Thai'],
    avgDeliveryTimeMinutes: 28,
    minOrderAmount: 149,
    deliveryFee: 20,
    isOpen: true,
    distance: '3.2 km',
    menu: [
      {
        id: 'mc6', name: 'Starters', items: [
          { id: 'm13', name: 'Chicken Manchurian Dry', description: 'Crispy chicken balls in spicy Manchurian sauce.', price: 269, imageUrl: `${IMG}1525755662160-7718cbe3efc9?w=300&h=200&fit=crop`, isVeg: false, isAvailable: true, preparationTimeMinutes: 15, isBestseller: true },
          { id: 'm14', name: 'Veg Spring Rolls', description: 'Crispy rolls stuffed with mixed veggies and glass noodles.', price: 179, imageUrl: `${IMG}1606502281375-c3b811e75b2f?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 12 },
        ]
      },
      {
        id: 'mc7', name: 'Main Course', items: [
          { id: 'm15', name: 'Kung Pao Chicken', description: 'Diced chicken with peanuts, dried chilis, Sichuan peppercorn.', price: 319, imageUrl: `${IMG}1534422298391-e4f8c172dddb?w=300&h=200&fit=crop`, isVeg: false, isAvailable: true, preparationTimeMinutes: 20 },
          { id: 'm16', name: 'Veg Hakka Noodles', description: 'Stir-fried noodles with crunchy vegetables and soy sauce.', price: 199, imageUrl: `${IMG}1569718212165-3a8278d5f624?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 15 },
          { id: 'm17', name: 'Chicken Fried Rice', description: 'Wok-tossed rice with egg, chicken, and fresh scallions.', price: 229, imageUrl: `${IMG}1603133872878-684f208fb84b?w=300&h=200&fit=crop`, isVeg: false, isAvailable: true, preparationTimeMinutes: 12 },
        ]
      },
    ],
  },
  {
    id: 'r4',
    name: 'Tandoori Nights',
    description: 'Royal North Indian cuisine with live tandoor and signature butter chicken.',
    coverImageUrl: `${IMG}1585937421612-70a008356fbe?w=800&h=400&fit=crop`,
    logoUrl: `${IMG}1585937421612-70a008356fbe?w=100&h=100&fit=crop`,
    address: '33 Whitefield Main Road',
    latitude: 12.9698,
    longitude: 77.7500,
    rating: 4.6,
    totalRatings: 3421,
    cuisines: ['North Indian', 'Mughlai', 'Tandoor'],
    avgDeliveryTimeMinutes: 40,
    minOrderAmount: 199,
    deliveryFee: 35,
    isOpen: true,
    distance: '4.0 km',
    promoted: true,
    menu: [
      {
        id: 'mc8', name: 'Chef\'s Special', items: [
          { id: 'm18', name: 'Butter Chicken', description: 'Iconic creamy tomato gravy with tender tandoori chicken pieces.', price: 329, imageUrl: `${IMG}1603894584373-5ac82b2ae328?w=300&h=200&fit=crop`, isVeg: false, isAvailable: true, preparationTimeMinutes: 20, isBestseller: true },
          { id: 'm19', name: 'Dal Makhani', description: 'Black lentils slow-cooked overnight with butter and cream.', price: 249, imageUrl: `${IMG}1546833999-b9f581e2b4d0?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 15, isBestseller: true },
          { id: 'm20', name: 'Paneer Butter Masala', description: 'Soft paneer cubes in rich buttery tomato gravy.', price: 269, imageUrl: `${IMG}1565557623262-b51c2513a641?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 18 },
        ]
      },
      {
        id: 'mc9', name: 'Tandoor', items: [
          { id: 'm21', name: 'Tandoori Chicken Half', description: 'Juicy chicken marinated in yogurt and spices, chargrilled.', price: 299, imageUrl: `${IMG}1610057099443-fde6c3d97fb3?w=300&h=200&fit=crop`, isVeg: false, isAvailable: true, preparationTimeMinutes: 25 },
          { id: 'm22', name: 'Garlic Naan', description: 'Soft naan loaded with garlic and butter.', price: 69, imageUrl: `${IMG}1600498148212-a27e0207a06e?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 8 },
        ]
      },
    ],
  },
  {
    id: 'r5',
    name: 'Green Bowl',
    description: 'Healthy bowls, smoothies, and clean eating. 100% organic ingredients.',
    coverImageUrl: `${IMG}1512621776951-a57141f2eefd?w=800&h=400&fit=crop`,
    logoUrl: `${IMG}1512621776951-a57141f2eefd?w=100&h=100&fit=crop`,
    address: '5 Koramangala 5th Block',
    latitude: 12.9347,
    longitude: 77.6205,
    rating: 4.4,
    totalRatings: 876,
    cuisines: ['Healthy', 'Salads', 'Smoothies'],
    avgDeliveryTimeMinutes: 20,
    minOrderAmount: 149,
    deliveryFee: 15,
    isOpen: true,
    distance: '0.8 km',
    menu: [
      {
        id: 'mc10', name: 'Power Bowls', items: [
          { id: 'm23', name: 'Quinoa Buddha Bowl', description: 'Quinoa, roasted chickpeas, avocado, hummus, mixed greens.', price: 349, imageUrl: `${IMG}1512621776951-a57141f2eefd?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 10, isBestseller: true },
          { id: 'm24', name: 'Grilled Chicken Poke Bowl', description: 'Brown rice, grilled chicken, edamame, mango, sesame dressing.', price: 399, imageUrl: `${IMG}1546069901-ba9599a7e63c?w=300&h=200&fit=crop`, isVeg: false, isAvailable: true, preparationTimeMinutes: 12 },
        ]
      },
      {
        id: 'mc11', name: 'Smoothies', items: [
          { id: 'm25', name: 'Berry Blast Smoothie', description: 'Mixed berries, banana, almond milk, chia seeds.', price: 199, imageUrl: `${IMG}1553530666-ba11a7da3888?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 5 },
          { id: 'm26', name: 'Green Detox', description: 'Spinach, kale, apple, ginger, lemon, coconut water.', price: 179, imageUrl: `${IMG}1610970881699-44a5587cabec?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 5 },
        ]
      },
    ],
  },
  {
    id: 'r6',
    name: 'Chai & Chill Café',
    description: 'Artisan coffee, cutting chai, and all-day breakfast. Cozy vibes.',
    coverImageUrl: `${IMG}1509042239860-f550ce710b93?w=800&h=400&fit=crop`,
    logoUrl: `${IMG}1509042239860-f550ce710b93?w=100&h=100&fit=crop`,
    address: '88 Church Street',
    latitude: 12.9751,
    longitude: 77.6097,
    rating: 4.2,
    totalRatings: 1543,
    cuisines: ['Café', 'Beverages', 'Snacks'],
    avgDeliveryTimeMinutes: 22,
    minOrderAmount: 99,
    deliveryFee: 15,
    isOpen: true,
    distance: '1.2 km',
    menu: [
      {
        id: 'mc12', name: 'Hot Beverages', items: [
          { id: 'm27', name: 'Masala Cutting Chai', description: 'Strong ginger-cardamom tea in a cutting glass.', price: 49, imageUrl: `${IMG}1556679343-c7306c1976bc?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 5, isBestseller: true },
          { id: 'm28', name: 'Hazelnut Latte', description: 'Espresso with steamed milk and hazelnut syrup.', price: 199, imageUrl: `${IMG}1461023058943-07fcbe16d735?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 5 },
        ]
      },
      {
        id: 'mc13', name: 'Snacks', items: [
          { id: 'm29', name: 'Vada Pav', description: 'Mumbai\'s iconic spicy potato fritter in a bun with chutneys.', price: 59, imageUrl: `${IMG}1606491956689-2ea866880049?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 8, isBestseller: true },
          { id: 'm30', name: 'Chicken Club Sandwich', description: 'Triple-decker with grilled chicken, bacon, lettuce, tomato.', price: 249, imageUrl: `${IMG}1528735602780-2552fd46c7af?w=300&h=200&fit=crop`, isVeg: false, isAvailable: true, preparationTimeMinutes: 12 },
        ]
      },
    ],
  },
  {
    id: 'r7',
    name: 'Dosa Republic',
    description: 'Crispy dosas from across South India. 40+ varieties including fusion dosas.',
    coverImageUrl: `${IMG}1630383249896-424e482df921?w=800&h=400&fit=crop`,
    logoUrl: `${IMG}1630383249896-424e482df921?w=100&h=100&fit=crop`,
    address: '22 BTM Layout 2nd Stage',
    latitude: 12.9166,
    longitude: 77.6101,
    rating: 4.3,
    totalRatings: 2105,
    cuisines: ['South Indian', 'Dosa', 'Idli'],
    avgDeliveryTimeMinutes: 25,
    minOrderAmount: 99,
    deliveryFee: 20,
    isOpen: true,
    distance: '2.5 km',
    menu: [
      {
        id: 'mc14', name: 'Classic Dosas', items: [
          { id: 'm31', name: 'Masala Dosa', description: 'Crispy golden dosa with spiced potato filling, served with sambar & chutney.', price: 129, imageUrl: `${IMG}1630383249896-424e482df921?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 12, isBestseller: true },
          { id: 'm32', name: 'Mysore Masala Dosa', description: 'Dosa with red chutney spread inside and potato masala.', price: 149, imageUrl: `${IMG}1668236543090-82eba5ee5976?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 15 },
          { id: 'm33', name: 'Rava Dosa', description: 'Crispy semolina dosa with onions and green chilis.', price: 139, imageUrl: `${IMG}1668236543090-82eba5ee5976?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 10 },
        ]
      },
      {
        id: 'mc15', name: 'Combos', items: [
          { id: 'm34', name: 'Idli Sambar (4 pcs)', description: 'Soft steamed rice cakes with hot sambar and coconut chutney.', price: 99, imageUrl: `${IMG}1589301760435-2232faf43540?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 10 },
          { id: 'm35', name: 'Mini Tiffin Combo', description: '2 Idli + 1 Vada + 1 Mini Dosa with sambar & chutneys.', price: 169, imageUrl: `${IMG}1589301760435-2232faf43540?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 15 },
        ]
      },
    ],
  },
  {
    id: 'r8',
    name: 'Burger Barn',
    description: 'Gourmet smashed burgers with house-made sauces. Juicy, messy, amazing.',
    coverImageUrl: `${IMG}1568901346375-23c9450c58cd?w=800&h=400&fit=crop`,
    logoUrl: `${IMG}1568901346375-23c9450c58cd?w=100&h=100&fit=crop`,
    address: '66 Marathahalli Bridge',
    latitude: 12.9563,
    longitude: 77.7011,
    rating: 4.0,
    totalRatings: 987,
    cuisines: ['Burgers', 'American', 'Fries'],
    avgDeliveryTimeMinutes: 25,
    minOrderAmount: 149,
    deliveryFee: 25,
    isOpen: true,
    distance: '3.8 km',
    menu: [
      {
        id: 'mc16', name: 'Smashed Burgers', items: [
          { id: 'm36', name: 'Classic Smash Burger', description: 'Double beef patty, American cheese, pickles, special sauce.', price: 299, imageUrl: `${IMG}1568901346375-23c9450c58cd?w=300&h=200&fit=crop`, isVeg: false, isAvailable: true, preparationTimeMinutes: 15, isBestseller: true },
          { id: 'm37', name: 'Crispy Chicken Burger', description: 'Buttermilk fried chicken, slaw, spicy mayo, brioche bun.', price: 279, imageUrl: `${IMG}1572802419224-296b0aeee0d9?w=300&h=200&fit=crop`, isVeg: false, isAvailable: true, preparationTimeMinutes: 15 },
          { id: 'm38', name: 'Paneer Tikka Burger', description: 'Grilled paneer tikka patty, mint chutney, onion rings.', price: 249, imageUrl: `${IMG}1550547660-d9450f859349?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 12 },
        ]
      },
      {
        id: 'mc17', name: 'Sides', items: [
          { id: 'm39', name: 'Loaded Fries', description: 'Crispy fries topped with cheese sauce, jalapeños, bacon bits.', price: 179, imageUrl: `${IMG}1573080496219-bb080dd4f877?w=300&h=200&fit=crop`, isVeg: false, isAvailable: true, preparationTimeMinutes: 10 },
          { id: 'm40', name: 'Onion Rings', description: 'Beer-battered onion rings with chipotle dip.', price: 149, imageUrl: `${IMG}1639024471283-03518883512d?w=300&h=200&fit=crop`, isVeg: true, isAvailable: true, preparationTimeMinutes: 8 },
        ]
      },
    ],
  },
];
