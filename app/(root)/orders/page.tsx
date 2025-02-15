import { getOrders } from "@/lib/actions/actions";
import { auth } from "@clerk/nextjs";

// Define the OrderItem type
interface OrderItemType {
  product: {
    _id: string;
    title: string;
    price: number;
  };
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

  return (
    <div className="px-10 py-5 max-sm:px-3">
      <p className="text-heading3-bold my-10">Your Orders</p>
      {!orders || orders.length === 0 ? (
        <p className="text-body-bold my-5">You have no orders yet.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {orders.map((order: OrderType) => (
            <div
              key={order._id}
              className="flex flex-col gap-8 p-4 hover:bg-grey-1 rounded-lg"
            >
              {/* Order ID and Total Amount */}
              <div className="flex gap-20 max-md:flex-col max-md:gap-3">
                <p className="text-base-bold">Order ID: {order._id}</p>
                <p className="text-base-bold">
                  Total Amount: KSh{order.totalAmount}
                </p>
              </div>

              {/* Billing Details */}
              <div className="flex flex-col gap-2">
                <p className="text-base-bold">Billing Details</p>
                <p className="text-small-medium">
                  Name:{" "}
                  <span className="text-small-bold">
                    {order.billingDetails?.firstName || "N/A"}{" "}
                    {order.billingDetails?.lastName || ""}
                  </span>
                </p>
                <p className="text-small-medium">
                  Phone:{" "}
                  <span className="text-small-bold">
                    {order.billingDetails?.phoneNumber || "N/A"}
                  </span>
                </p>
                <p className="text-small-medium">
                  Town/City:{" "}
                  <span className="text-small-bold">
                    {order.billingDetails?.townCity || "N/A"}
                  </span>
                </p>
                {order.billingDetails?.companyName && (
                  <p className="text-small-medium">
                    Company:{" "}
                    <span className="text-small-bold">
                      {order.billingDetails.companyName}
                    </span>
                  </p>
                )}
                {order.billingDetails?.orderNotes && (
                  <p className="text-small-medium">
                    Notes:{" "}
                    <span className="text-small-bold">
                      {order.billingDetails.orderNotes}
                    </span>
                  </p>
                )}
              </div>

              {/* Shipping Details */}
              <div className="flex flex-col gap-2">
                <p className="text-base-bold">Shipping Details</p>
                <p className="text-small-medium">
                  Method:{" "}
                  <span className="text-small-bold">
                    {order.shippingDetails?.shippingMethod || "N/A"}
                  </span>
                </p>
                <p className="text-small-medium">
                  Cost:{" "}
                  <span className="text-small-bold">
                    KSh{order.shippingDetails?.shippingCost || "N/A"}
                  </span>
                </p>
              </div>

              {/* Payment Details */}
              <div className="flex flex-col gap-2">
                <p className="text-base-bold">Payment Details</p>
                <p className="text-small-medium">
                  Mpesa Name:{" "}
                  <span className="text-small-bold">
                    {order.paymentDetails?.mpesaName || "N/A"}
                  </span>
                </p>
                <p className="text-small-medium">
                  Mobile Number:{" "}
                  <span className="text-small-bold">
                    {order.paymentDetails?.mobileNumber || "N/A"}
                  </span>
                </p>
                <p className="text-small-medium">
                  Transaction Code:{" "}
                  <span className="text-small-bold">
                    {order.paymentDetails?.transactionCode || "N/A"}
                  </span>
                </p>
              </div>

              {/* Products */}
              <div className="flex flex-col gap-5">
                <p className="text-base-bold">Products</p>
                {order.products.map((orderItem: OrderItemType) => (
                  <div
                    key={orderItem.product._id}
                    className="flex flex-col gap-2"
                  >
                    <p className="text-body-bold">
                      {orderItem.product.title}
                    </p>
                    <p className="text-small-medium">
                      Price:{" "}
                      <span className="text-small-bold">
                        KSh{orderItem.product.price}
                      </span>
                    </p>
                    {orderItem.color && (
                      <p className="text-small-medium">
                        Color:{" "}
                        <span className="text-small-bold">
                          {orderItem.color}
                        </span>
                      </p>
                    )}
                    {orderItem.size && (
                      <p className="text-small-medium">
                        Size:{" "}
                        <span className="text-small-bold">
                          {orderItem.size}
                        </span>
                      </p>
                    )}
                    <p className="text-small-medium">
                      Quantity:{" "}
                      <span className="text-small-bold">
                        {orderItem.quantity}
                      </span>
                    </p>
                  </div>
                ))}
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