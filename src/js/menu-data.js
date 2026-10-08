/**
 * Shiv Restaurant — Signature Menu Dataset
 * Authentic Indian Cuisine, Jaunpur, Uttar Pradesh 222136
 */

export const MENU_ITEMS = [
  {
    id: 'kadai-paneer',
    name: 'Kadai Paneer',
    category: 'Main Course',
    description: 'Fresh cottage cheese cubes tossed with crisp bell peppers, onions, and freshly ground kadai masala in a rich roasted tomato reduction.',
    longDescription: 'A classic North Indian royal preparation where handmade paneer is gently seared and folded into a thick, spiced gravy. Hand-pounded coriander seeds, dry red chilies, and fenugreek leaves yield an intoxicating rustic aroma.',
    image: '/src/assets/images/dish_kadai_paneer_1791443877999.jpg',
    spiceLevel: 'Medium-Spiced',
    ingredients: ['Fresh Malai Paneer', 'Crisp Bell Peppers', 'Roasted Tomatoes', 'Hand-ground Kadai Masala', 'Fresh Ginger', 'Kasuri Methi'],
    preparationNote: 'Cooked in high-heat iron kadai to seal smoky aromatics.',
    pairingRecommendation: 'Best enjoyed with hot Aloo Paratha or Steamed Rice.',
    modelAccentColor: 0xe58e26
  },
  {
    id: 'mix-veg-curry',
    name: 'Mix Veg Curry',
    category: 'Main Course',
    description: 'Melange of tender seasonal vegetables slow-cooked in a silky, aromatic onion-tomato spiced gravy with subtle fragrant herbs.',
    longDescription: 'Fresh local farm vegetables simmered gently so each retains its distinct texture and vibrant taste. Infused with ginger juliennes, green cardamom, and freshly crushed garam masala for a wholesome, comforting meal.',
    image: '/src/assets/images/dish_mix_veg_1791443902039.jpg',
    spiceLevel: 'Mild to Medium',
    ingredients: ['Garden Peas', 'Carrots', 'Cauliflower Florets', 'French Beans', 'Paneer Cubes', 'Onion-Tomato Gravy'],
    preparationNote: 'Slow-simmered in copper handi for deep flavour infusion.',
    pairingRecommendation: 'Pairs perfectly with crisp Parathas or Daal Tadka.',
    modelAccentColor: 0xd97706
  },
  {
    id: 'daal-tadka',
    name: 'Daal Tadka',
    category: 'Main Course',
    description: 'Slow-simmered golden yellow lentils crowned with a sizzling aromatic tempering of pure ghee, cumin seeds, garlic, and whole dried red chilies.',
    longDescription: 'The quintessential soul of authentic Indian dining. Yellow lentils cooked until silky smooth, then invigorated by a crackling ghee tadka poured sizzling hot at the final moment of serving, sending wafts of roasted cumin and garlic into the air.',
    image: '/src/assets/images/dish_daal_tadka_1791443891919.jpg',
    spiceLevel: 'Mild Aromatic',
    ingredients: ['Toor & Moong Lentils', 'Desi Ghee', 'Cumin Seeds', 'Whole Red Chilies', 'Crushed Garlic', 'Fresh Cilantro'],
    preparationNote: 'Finished with a smoking hot charcoal-infused ghee sizzle.',
    pairingRecommendation: 'Unbeatable alongside Aloo Paratha or Jeera Rice.',
    modelAccentColor: 0xf59e0b
  },
  {
    id: 'aloo-paratha',
    name: 'Aloo Paratha',
    category: 'Breads',
    description: 'Crisp, golden-brown whole wheat flatbread generously stuffed with spiced herb-infused mashed potatoes, served piping hot with fresh butter.',
    longDescription: 'Hand-rolled whole wheat dough packed with savory mashed potatoes seasoned with roasted cumin, green chilies, coriander, and dry mango powder. Griddled to a flaky golden crispness on a heavy tawa and topped with a melting white butter dollop.',
    image: '/src/assets/images/dish_aloo_paratha_1791443913904.jpg',
    spiceLevel: 'Mild to Zesty',
    ingredients: ['Whole Wheat Flour', 'Spiced Potato Mash', 'Roasted Cumin', 'Green Chilies', 'Fresh Coriander', 'White Butter'],
    preparationNote: 'Slow-griddled on cast iron tawa until crisp and layered.',
    pairingRecommendation: 'Delicious with Daal Tadka, Kadai Paneer, or Chai.',
    modelAccentColor: 0xd4af37
  },
  {
    id: 'paneer-pakoda',
    name: 'Paneer Pakoda',
    category: 'Appetizers & Snacks',
    description: 'Tender cottage cheese slices layered with tangy mint-coriander chutney, encased in a seasoned spiced gram flour batter and fried until crisp.',
    longDescription: 'Succulent fresh paneer slabs delicately stuffed with tangy mint chutney, dipped into an airy, spiced besan batter kissed with carom seeds (ajwain), and deep-fried to golden perfection. Crisp on the exterior and melt-in-mouth tender inside.',
    image: '/src/assets/images/dish_pakoda_chai_1791443923768.jpg',
    spiceLevel: 'Zesty Mild',
    ingredients: ['Fresh Paneer', 'Gram Flour (Besan)', 'Ajwain (Carom Seeds)', 'Mint Chutney', 'Chaat Masala', 'Turmeric'],
    preparationNote: 'Double-fried for extra crunch with zero greasiness.',
    pairingRecommendation: 'Essential companion to a hot cup of cutting Chai.',
    modelAccentColor: 0xeab308
  },
  {
    id: 'onion-pakoda',
    name: 'Onion Pakoda',
    category: 'Appetizers & Snacks',
    description: 'Crunchy golden fritters of thinly sliced onions tossed with crushed coriander, ajwain, green chilies, and spiced gram flour.',
    longDescription: 'Thinly sliced sweet red onions massaged with sea salt, fresh ginger, and crushed coriander seeds, lightly bound in gram flour and fried until deeply caramelized and supremely crispy. An authentic monsoon and evening classic in Uttar Pradesh.',
    image: '/src/assets/images/dish_pakoda_chai_1791443923768.jpg',
    spiceLevel: 'Zesty & Crisp',
    ingredients: ['Sliced Red Onions', 'Gram Flour', 'Fresh Green Chilies', 'Crushed Coriander Seeds', 'Ajwain', 'Rock Salt'],
    preparationNote: 'Hand-tossed in small batches to maximize crispy edges.',
    pairingRecommendation: 'Best savoured steaming hot alongside Kadak Chai.',
    modelAccentColor: 0xc27803
  },
  {
    id: 'chai',
    name: 'Chai (Authentic Masala Tea)',
    category: 'Beverages',
    description: 'Traditional slow-brewed Indian milk tea infused with freshly crushed green cardamom, warming ginger, and aromatic whole spices.',
    longDescription: 'Rich black tea leaves simmered patiently with fresh creamy milk and spring water, aromatic crushed green cardamom pods, fresh ginger root, and a hint of cinnamon. Served steaming hot, revitalizing both body and spirit.',
    image: '/src/assets/images/dish_pakoda_chai_1791443923768.jpg',
    spiceLevel: 'Warm Spiced',
    ingredients: ['Assam Black Tea Leaves', 'Fresh Milk', 'Crushed Cardamom', 'Fresh Ginger', 'Cinnamon Stick', 'Raw Cane Sugar'],
    preparationNote: 'Aired and boiled to golden froth in traditional copper kettle.',
    pairingRecommendation: 'The ultimate pairing with hot Pakodas and Parathas.',
    modelAccentColor: 0xb45309
  }
];
