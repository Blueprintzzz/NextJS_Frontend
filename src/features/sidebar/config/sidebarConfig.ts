import type { LucideIcon } from 'lucide-react';
import { Calendar, PlusCircle, Car, MapPin, Map, LayoutGrid, Package, Star, MessageSquare, ShieldCheck, UserCircle, LayoutDashboard, User, DollarSign, ClipboardList, Store, Users, TrendingUp, Bell, ShoppingCart, Sparkles, Home } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const touristGroup: NavGroup = {
  label: 'Tourist',
  items: [
    { label: 'Dashboard', href: '/tourist/dashboard', icon: Home },
    { label: 'My Profile', href: '/tourist/profile', icon: UserCircle },
    { label: 'Recommendations', href: '/tourist/recommendations', icon: Sparkles },
    { label: 'My Cart', href: '/tourist/cart', icon: ShoppingCart },
    { label: 'Notifications', href: '/tourist/notifications', icon: Bell },
  ],
};

export const driverGroup: NavGroup = {
  label: 'Driver',
  items: [
    { label: 'Dashboard', href: '/driver/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', href: '/driver/profile', icon: User },
    { label: 'My Vehicles', href: '/driver/vehicles', icon: Car },
    { label: 'My Packages', href: '/driver/packages', icon: Package },
    { label: 'Booking Requests', href: '/driver/booking-requests', icon: ClipboardList },
    { label: 'My Bookings', href: '/driver/bookings', icon: Calendar },
    { label: 'Earnings', href: '/driver/earnings', icon: DollarSign },
  ],
};

export const bookingsGroup: NavGroup = {
  label: 'Bookings',
  items: [
    { label: 'Booking History', href: '/bookings', icon: Calendar },
    { label: 'Create Booking', href: '/bookings/create', icon: PlusCircle },
  ],
};

export const packagesGroup: NavGroup = {
  label: 'Packages',
  items: [
    { label: 'All Packages', href: '/packages', icon: Package },
    { label: 'Featured Packages', href: '/packages/featured', icon: Star },
    { label: 'Create Package', href: '/packages/create', icon: PlusCircle },
  ],
};

export const driverVehiclesGroup: NavGroup = {
  label: 'Vehicles',
  items: [
    { label: 'My Vehicles', href: '/driver/vehicles', icon: Car },
  ],
};

export const destinationsGroup: NavGroup = {
  label: 'Destinations',
  items: [
    { label: 'Explore Map', href: '/map', icon: Map },
    { label: 'All Districts', href: '/destinations', icon: MapPin },
  ],
};

export const reviewsGroup: NavGroup = {
  label: 'Reviews',
  items: [
    { label: 'All Reviews', href: '/reviews', icon: Star },
    { label: 'My Reviews', href: '/account/reviews', icon: UserCircle },
  ],
};

export const adminGroup: NavGroup = {
  label: 'Admin',
  items: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Drivers', href: '/admin/drivers', icon: Car },
    { label: 'Suppliers', href: '/admin/suppliers', icon: Store },
    { label: 'Packages', href: '/admin/packages', icon: Package },
    { label: 'Experiences', href: '/admin/experiences', icon: Star },
    { label: 'Destinations', href: '/admin/destinations', icon: MapPin },
    { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
    { label: 'Reviews', href: '/admin/reviews', icon: ShieldCheck },
    { label: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
    { label: 'Categories', href: '/admin/categories', icon: LayoutGrid },
  ],
};

// Full flat list — kept for any consumers that still import sidebarGroups
export const sidebarGroups: NavGroup[] = [
  touristGroup, driverGroup, bookingsGroup, packagesGroup,
  driverVehiclesGroup, destinationsGroup, reviewsGroup, adminGroup,
];
