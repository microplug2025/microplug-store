import { getOrders } from "@/lib/actions/actions";
import { auth } from "@clerk/nextjs";
import { Box, Truck, CreditCard, User, Calendar } from "lucide-react";

// Define the OrderItem type
interface OrderItemType {
  product: {
    _id: string;
    title: string;
    price: number;
  } | null; // Allow product to be null
  color?: string;
  size?: string;
  quantity: number;
}

// Define the Order type
interface OrderType {
  _id: string;
  customerClerkId: string;
  email: string;
  name: string;
  products: OrderItemType[];
  billingDetails?: {
    firstName?: string;
    lastName?: string;
    companyName?: string;
    townCity?: string;
    phoneNumber?: string;
    orderNotes?: string;
  };
  shippingDetails?: {
    shippingMethod?: string;
    shippingCost?: number;
  };
  paymentDetails?: {
    mpesaName?: string;
    mobileNumber?: string;
    transactionCode?: string;
  };
  totalAmount: number;
  createdAt: Date;
}

const Orders = async () => {
  const { userId } = auth();

  // Fetch orders with type safety
  const orders: OrderType[] = await getOrders(userId as string);

  // Sort orders by createdAt in descending order (newest first)
  const sortedOrders = orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Format date function
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="px-10 py-5 max-sm:px-3 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-300 min-h-screen">
      <p className="text-heading3-bold my-10 text-indigo-900">Your Orders</p>
      {!sortedOrders || sortedOrders.length === 0 ? (
        <p className="text-body-bold my-5 text-red-600">You have no orders yet.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {sortedOrders.map((order: OrderType) => (
            <div
              key={order._id}
              className="flex flex-col gap-6 p-6 bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Order ID, Date, and Total Amount */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-purple-700">
                  <Calendar />
                  <p className="text-base-bold text-gray-800">
                    Order Date: {" "}
                    <span className="font-normal">{formatDate(order.createdAt)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <Box />
                  <p className="text-base-bold text-gray-800">
                    Order ID: {" "}
                    <span className="font-normal">{order._id}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <CreditCard />
                  <p className="text-base-bold text-gray-800">
                    Total Amount: {" "}
                    <span className="font-normal">KSh{order.totalAmount}</span>
                  </p>
                </div>
              </div>

              {/* Billing Details */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-red-700">
                  <User />
                  <p className="text-lg font-semibold text-gray-900">Billing Details</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-small-medium text-gray-700">
                    Name: {" "}
                    <span className="text-small-bold text-gray-900">
                      {order.billingDetails?.firstName || "N/A"} {" "}
                      {order.billingDetails?.lastName || ""}
                    </span>
                  </p>
                  <p className="text-small-medium text-gray-700">
                    Phone: {" "}
                    <span className="text-small-bold text-gray-900">
                      {order.billingDetails?.phoneNumber || "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-teal-700">
                  <Truck />
                  <p className="text-lg font-semibold text-gray-900">Shipping Details</p>
                </div>
                <p className="text-small-medium text-gray-700">
                  Shipping Method: {" "}
                  <span className="text-small-bold text-gray-900">
                    {order.shippingDetails?.shippingMethod || "N/A"}
                  </span>
                </p>
                <p className="text-small-medium text-gray-700">
                  Shipping Cost: {" "}
                  <span className="text-small-bold text-gray-900">
                    KSh{order.shippingDetails?.shippingCost || 0}
                  </span>
                </p>
              </div>

              {/* Product Details */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-orange-700">
                  <Box />
                  <p className="text-lg font-semibold text-gray-900">Products</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.products.map((orderItem: OrderItemType, index: number) => (
                    orderItem.product ? (
                      <div
                        key={orderItem.product._id}
                        className="flex flex-col gap-2 p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200"
                      >
                        <p className="text-body-bold text-gray-800">{orderItem.product.title}</p>
                        <p className="text-small-medium text-gray-600">
                          Price: {" "}
                          <span className="text-small-bold text-gray-800">
                            KSh{orderItem.product.price}
                          </span>
                        </p>
                        {orderItem.color && (
                          <p className="text-small-medium text-gray-600">
                            Color: <span className="text-small-bold text-gray-800">{orderItem.color}</span>
                          </p>
                        )}
                        {orderItem.size && (
                          <p className="text-small-medium text-gray-600">
                            Size: <span className="text-small-bold text-gray-800">{orderItem.size}</span>
                          </p>
                        )}
                        <p className="text-small-medium text-gray-600">
                          Quantity: <span className="text-small-bold text-gray-800">{orderItem.quantity}</span>
                        </p>
                      </div>
                    ) : (
                      <p key={`unknown-${index}`} className="text-gray-600">Product not available</p>
                    )
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

export const dynamic = "force-dynamic";
