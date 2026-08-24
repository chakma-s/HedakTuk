// ============================================
// @hedaktuk/shared-types
// Core TypeScript interfaces shared across all apps
// ============================================

// ---- Enums ----

export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    RESTAURANT_OWNER = 'RESTAURANT_OWNER',
    DELIVERY_PARTNER = 'DELIVERY_PARTNER',
    ADMIN = 'ADMIN',
}

export enum OrderStatus {
    PLACED = 'PLACED',
    CONFIRMED = 'CONFIRMED',
    PREPARING = 'PREPARING',
    READY = 'READY',
    PICKED_UP = 'PICKED_UP',
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
    UPI = 'UPI',
    CARD = 'CARD',
    WALLET = 'WALLET',
    NET_BANKING = 'NET_BANKING',
    COD = 'COD',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

// ---- User ----

export interface User {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    avatarUrl: string | null;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Address {
    id: string;
    userId: string;
    label: string; // "Home" | "Work" | "Other"
    fullAddress: string;
    landmark: string | null;
    latitude: number;
    longitude: number;
    isDefault: boolean;
}

// ---- Restaurant ----

export interface Restaurant {
    id: string;
    ownerId: string;
    name: string;
    description: string | null;
    coverImageUrl: string | null;
    logoUrl: string | null;
    address: string;
    latitude: number;
    longitude: number;
    rating: number;
    totalRatings: number;
    cuisines: string[];
    avgDeliveryTimeMinutes: number;
    minOrderAmount: number;
    deliveryFee: number;
    isActive: boolean;
    isOpen: boolean;
    operatingHours: OperatingHours;
    createdAt: string;
}

export interface OperatingHours {
    monday: DayHours | null;
    tuesday: DayHours | null;
    wednesday: DayHours | null;
    thursday: DayHours | null;
    friday: DayHours | null;
    saturday: DayHours | null;
    sunday: DayHours | null;
}

export interface DayHours {
    open: string; // "09:00"
    close: string; // "23:00"
}

// ---- Menu ----

export interface MenuCategory {
    id: string;
    restaurantId: string;
    name: string;
    sortOrder: number;
    items?: MenuItem[];
}

export interface MenuItem {
    id: string;
    restaurantId: string;
    categoryId: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    isVeg: boolean;
    isAvailable: boolean;
    preparationTimeMinutes: number;
}

// ---- Cart ----

export interface CartItem {
    id: string;
    menuItemId: string;
    menuItem: MenuItem;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface Cart {
    id: string;
    userId: string;
    restaurantId: string;
    restaurant: Pick<Restaurant, 'id' | 'name' | 'logoUrl' | 'deliveryFee' | 'minOrderAmount'>;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
}

// ---- Order ----

export interface Order {
    id: string;
    userId: string;
    restaurantId: string;
    restaurant: Pick<Restaurant, 'id' | 'name' | 'logoUrl' | 'address'>;
    deliveryPartnerId: string | null;
    status: OrderStatus;
    items: OrderItem[];
    deliveryAddress: Address;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    couponCode: string | null;
    estimatedDeliveryMinutes: number | null;
    specialInstructions: string | null;
    createdAt: string;
    deliveredAt: string | null;
}

export interface OrderItem {
    id: string;
    orderId: string;
    menuItemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    isVeg: boolean;
}

// ---- Payment ----

export interface Payment {
    id: string;
    orderId: string;
    method: PaymentMethod;
    status: PaymentStatus;
    amount: number;
    gatewayTransactionId: string | null;
    createdAt: string;
}

// ---- Coupon ----

export interface Coupon {
    id: string;
    code: string;
    description: string;
    discountType: 'PERCENTAGE' | 'FLAT';
    discountValue: number;
    minOrderAmount: number;
    maxDiscount: number | null;
    usageLimit: number | null;
    usedCount: number;
    validFrom: string;
    validUntil: string;
    isActive: boolean;
}

// ---- Review ----

export interface Review {
    id: string;
    userId: string;
    userName: string;
    restaurantId: string;
    orderId: string;
    rating: number; // 1-5
    comment: string | null;
    createdAt: string;
}

// ---- API Response Wrappers ----

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ApiError {
    success: false;
    message: string;
    error?: string;
    statusCode: number;
}

// ---- Auth ----

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface OtpSendRequest {
    phone: string;
}

export interface OtpVerifyRequest {
    phone: string;
    otp: string;
}

// ---- Socket Events ----

export enum SocketEvent {
    // Client → Server
    JOIN_ORDER_ROOM = 'join_order_room',
    LEAVE_ORDER_ROOM = 'leave_order_room',

    // Server → Client
    ORDER_STATUS_UPDATED = 'order_status_updated',
    DELIVERY_LOCATION_UPDATED = 'delivery_location_updated',
    NEW_ORDER_RECEIVED = 'new_order_received', // for restaurant
}

export interface OrderStatusUpdatePayload {
    orderId: string;
    status: OrderStatus;
    estimatedDeliveryMinutes?: number;
    updatedAt: string;
}

export interface DeliveryLocationPayload {
    orderId: string;
    latitude: number;
    longitude: number;
    updatedAt: string;
}

// New additions for Logistics and Finance phases
export interface DriverEarning {
    id: string;
    driverId: string;
    orderId: string;
    deliveryFee: number;
    tip: number;
    bonus: number;
    totalEarning: number;
    paidOut: boolean;
    createdAt: string;
}

export interface FinanceSummary {
    totalRevenue: number;
    totalCommissions: number;
    pendingPayouts: number;
    totalPaid: number;
}
