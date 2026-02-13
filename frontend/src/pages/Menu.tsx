import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menuService, MenuItem as APIMenuItem } from '../services/menuService';
import { ShoppingCartIcon, MagnifyingGlassIcon, XMarkIcon, PlusIcon, MinusIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';

interface CartItem extends APIMenuItem {
  quantity: number;
}

/* ---- Toast notification (replaces alert) ---- */
const Toast: React.FC<{ message: string; show: boolean }> = ({ message, show }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
      <div className="flex items-center gap-2 px-5 py-3 bg-[#1a2233] text-white rounded-xl shadow-2xl text-sm font-medium">
        <CheckIcon className="h-4 w-4 text-[#FFD700]" />
        {message}
      </div>
    </div>
  );
};

const Menu: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [searchParams] = useSearchParams();

  const tableNumber = searchParams.get('table');
  const isGuestMode = !!tableNumber;

  const [menuItems, setMenuItems] = useState<APIMenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [showGuestNameModal, setShowGuestNameModal] = useState(false);
  const [toast, setToast] = useState({ message: '', show: false });

  const showToast = useCallback((msg: string) => {
    setToast({ message: msg, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 2000);
  }, []);

  useEffect(() => {
    if (location.state?.clearCart) {
      setCart([]);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    loadMenu();
    const cartKey = isGuestMode ? `guest_cart_table_${tableNumber}` : `cart_${user?.id}`;
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) setCart(JSON.parse(savedCart));
    if (isGuestMode) {
      const saved = localStorage.getItem(`guest_name_table_${tableNumber}`);
      if (saved) setGuestName(saved);
    }
  }, [selectedCategory, user, tableNumber, isGuestMode]);

  const loadMenu = async () => {
    setLoading(true);
    const filters = selectedCategory ? { category_id: selectedCategory } : {};
    const [menuResult, categoriesResult] = await Promise.all([
      menuService.getMenu(filters),
      menuService.getCategories(),
    ]);
    if (menuResult.success) setMenuItems(menuResult.data);
    if (categoriesResult.success) setCategories(categoriesResult.data);
    setLoading(false);
  };

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    const key = isGuestMode ? `guest_cart_table_${tableNumber}` : `cart_${user?.id}`;
    localStorage.setItem(key, JSON.stringify(newCart));
  };

  const addToCart = (item: APIMenuItem) => {
    if (isGuestMode && !guestName) {
      setShowGuestNameModal(true);
      (window as any).pendingCartItem = item;
      return;
    }
    if (!isGuestMode && !user) {
      if (window.confirm('Please login to add items to cart. Go to login page?')) navigate('/auth');
      return;
    }
    const existing = cart.find(c => c.id === item.id);
    const newCart = existing
      ? cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
      : [...cart, { ...item, quantity: 1 }];
    saveCart(newCart);
    showToast(`${item.name} added to cart`);
  };

  const handleGuestNameSubmit = () => {
    if (!guestName.trim()) return;
    localStorage.setItem(`guest_name_table_${tableNumber}`, guestName);
    setShowGuestNameModal(false);
    const pending = (window as any).pendingCartItem;
    if (pending) { addToCart(pending); (window as any).pendingCartItem = null; }
  };

  const removeFromCart = (itemId: number) => saveCart(cart.filter(i => i.id !== itemId));

  const updateQuantity = (itemId: number, change: number) => {
    const newCart = cart.map(i => i.id === itemId ? { ...i, quantity: Math.max(1, i.quantity + change) } : i);
    saveCart(newCart);
  };

  const getTotalPrice = () => cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const getTotalItems = () => cart.reduce((t, i) => t + i.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) { showToast('Your cart is empty!'); return; }
    if (isGuestMode) {
      navigate('/guest-checkout', { state: { cart, tableNumber, guestName } });
    } else {
      navigate('/checkout', { state: { cart } });
    }
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---- Skeleton ---- */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-60 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="flex gap-3 mb-8">
            {[1,2,3,4,5].map(i => <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-full bg-gray-200 rounded mb-4" />
                  <div className="flex justify-between">
                    <div className="h-6 w-20 bg-gray-200 rounded" />
                    <div className="h-10 w-28 bg-gray-200 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-16">
      <Toast message={toast.message} show={toast.show} />

      {/* Sticky Header */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="text-xl font-bold text-[#1a2233]">Our Menu</h1>
                  {isGuestMode && (
                    <p className="text-xs text-gray-500 mt-0.5">Table {tableNumber} {guestName && `· ${guestName}`}</p>
                  )}
                </div>
                {!isGuestMode && user && (
                  <button onClick={() => navigate('/my-orders')} className="text-xs font-semibold text-[#FFD700] hover:text-[#e6c200] transition-colors">
                    My Orders →
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] transition-all outline-none"
                />
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setShowCart(true)}
              className="relative flex items-center gap-2 px-4 py-2.5 bg-[#1a2233] text-white rounded-xl hover:bg-[#2d3748] transition-colors flex-shrink-0"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:inline">Cart</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#FFD700] text-[#1a2233] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>

          {/* Categories */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? 'bg-[#1a2233] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#1a2233] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🍽️</div>
            <h3 className="text-lg font-semibold text-[#1a2233] mb-1">No dishes found</h3>
            <p className="text-sm text-gray-500">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map(item => {
              const inCart = cart.find(c => c.id === item.id);
              return (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                        <span className="text-5xl opacity-50">🍽️</span>
                      </div>
                    )}
                    {!item.is_available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">Unavailable</span>
                      </div>
                    )}
                    {inCart && (
                      <div className="absolute top-3 right-3 w-7 h-7 bg-[#FFD700] rounded-full flex items-center justify-center text-[10px] font-bold text-[#1a2233] shadow-lg">
                        {inCart.quantity}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-[#1a2233] mb-1">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#1a2233]">Rs. {item.price.toFixed(0)}</span>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.is_available}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          item.is_available
                            ? 'bg-[#FFD700] text-[#1a2233] hover:bg-[#e6c200] active:scale-95'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <PlusIcon className="h-4 w-4" />
                        {inCart ? 'Add More' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Guest Name Modal */}
      {showGuestNameModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">👋</div>
              <h3 className="text-xl font-bold text-[#1a2233]">Welcome!</h3>
              <p className="text-sm text-gray-500 mt-1">Please enter your name to start ordering</p>
            </div>
            <input
              type="text"
              placeholder="Your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGuestNameSubmit()}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700] outline-none text-center text-lg"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={handleGuestNameSubmit} className="flex-1 py-3 bg-[#FFD700] text-[#1a2233] rounded-xl font-semibold hover:bg-[#e6c200] transition-colors">
                Continue
              </button>
              <button onClick={() => setShowGuestNameModal(false)} className="px-5 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-[#1a2233]">Your Cart</h2>
                <p className="text-xs text-gray-500">{getTotalItems()} items</p>
              </div>
              <button onClick={() => setShowCart(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <XMarkIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCartIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">Add delicious items from the menu!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">🍽️</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#1a2233] truncate">{item.name}</h3>
                        <p className="text-sm font-bold text-[#FFD700] mt-0.5">Rs. {(item.price * item.quantity).toFixed(0)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                            <MinusIcon className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                            <PlusIcon className="h-3 w-3" />
                          </button>
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-400 hover:text-red-600 transition-colors">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-5 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-semibold text-gray-600">Total</span>
                  <span className="text-xl font-bold text-[#1a2233]">Rs. {getTotalPrice().toFixed(0)}</span>
                </div>
                <button onClick={handleCheckout} className="w-full py-3.5 bg-[#FFD700] text-[#1a2233] rounded-xl font-bold text-base hover:bg-[#e6c200] active:scale-[0.98] transition-all shadow-lg shadow-[#FFD700]/20">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
