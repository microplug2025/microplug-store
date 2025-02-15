"use client";

import { useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useCart from "@/lib/hooks/useCart";
import { useUser } from "@clerk/nextjs";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Paymentinfo from "@/components/Payment-details";
// Validation schemas using Zod
const billingDetailsSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  companyName: z.string().optional(),
  townCity: z.string().min(3, "Town/City is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  orderNotes: z.string().optional(),
});

const shippingDetailsSchema = z.object({
  shippingMethod: z.string().min(1, "Please select a shipping method"),
});

const mpesaPaymentSchema = z.object({
  mpesaName: z.string().min(1, "Mpesa Name is required"),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  transactionCode: z.string().min(1, "Transaction code is required"),
});

type BillingDetailsForm = z.infer<typeof billingDetailsSchema>;
type ShippingDetailsForm = z.infer<typeof shippingDetailsSchema>;
type MpesaPaymentForm = z.infer<typeof mpesaPaymentSchema>;

const Cart = () => {
  const router = useRouter();
  const { user } = useUser();
  const cart = useCart();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [shippingCost, setShippingCost] = useState<number>(0);

  const total = cart.cartItems.reduce(
    (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
    0
  );
  const totalRounded = parseFloat(total.toFixed(2));

  const customer = {
    clerkId: user?.id,
    email: user?.emailAddresses[0].emailAddress,
    name: user?.fullName,
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(
      z.object({
        ...billingDetailsSchema.shape,
        ...shippingDetailsSchema.shape,
        ...mpesaPaymentSchema.shape,
      })
    ),
  });

  const shippingRates: { [key: string]: number } = {
    "Wells Fargo Nairobi": 320,
    "Wells Fargo Nairobi Outskirts": 330,
    "Matatu Courier Mt. Kenya Region": 250,
    "Ena Coach Western Kenya": 300,
    "Pick up from shop": 0,
    "Matatu Courier Eldoret": 250,
    "Super Metro Juja": 150,
    "Matatu Courier Coastal Region": 300,
  };

  const handleShippingMethodChange = (value: string) => {
    setValue("shippingMethod", value);
    setShippingCost(shippingRates[value] || 0);
  };

  const handleCheckout = async (checkoutData: FieldValues) => {
    try {
      if (!user) {
        router.push("sign-in");
      } else {
        const payload = {
          customer,
          cartItems: cart.cartItems,
          billingDetails: {
            firstName: checkoutData.firstName,
            lastName: checkoutData.lastName,
            companyName: checkoutData.companyName,
            townCity: checkoutData.townCity,
            phoneNumber: checkoutData.phoneNumber,
            orderNotes: checkoutData.orderNotes,
          },
          shippingDetails: {
            shippingMethod: checkoutData.shippingMethod,
            shippingCost,
          },
          paymentDetails: {
            mpesaName: checkoutData.mpesaName,
            mobileNumber: checkoutData.mobileNumber,
            transactionCode: checkoutData.transactionCode,
          },
          totalAmount: totalRounded + shippingCost,
        };
        // Log the payload before sending it to the backend
        console.log("Data being sent to the backend:", payload);
        console.log("Cart items in state:", cart.cartItems);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          console.log("Checkout successful:", data);
          router.push('/payment_success'); 
          // Handle success (e.g., show a success message or redirect)
        }
      }
    } catch (err) {
      console.log("[checkout_POST]", err);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsSubmitting(true); // Disable button immediately
    await handleCheckout(data);
    setIsSubmitting(false); // Re-enable button after process
  };

  const renderError = (fieldError: any) =>
    fieldError?.message ? <span className="text-red-500 text-sm">{fieldError.message}</span> : null;

  const handleCheckoutClick = () => {
    if (!user) {
      router.push("sign-in");
    } else {
      setShowCheckoutForm(true);
    }
  };


  
  return (
    <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3">
      <div className="w-2/3 max-lg:w-full">
        <p className="text-heading3-bold">Shopping Cart</p>
        <hr className="my-6" />

        {cart.cartItems.length === 0 ? (
          <p className="text-body-bold">No item in cart</p>
        ) : (
          <div>
            {cart.cartItems.map((cartItem) => (
              <div
                key={cartItem.item._id}
                className="w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between"
              >
                <div className="flex items-center">
                  <Image
                    src={cartItem.item.media[0]}
                    width={100}
                    height={100}
                    className="rounded-lg w-32 h-32 object-cover"
                    alt="product"
                  />
                  <div className="flex flex-col gap-3 ml-4">
                    <p className="text-body-bold">{cartItem.item.title}</p>
                    {cartItem.color && (
                      <p className="text-small-medium">{cartItem.color}</p>
                    )}
                    {cartItem.size && (
                      <p className="text-small-medium">{cartItem.size}</p>
                    )}
                    <p className="text-small-medium">${cartItem.item.price}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <MinusCircle
                    className={`hover:text-red-1 cursor-pointer ${
                      cartItem.quantity <= 1 ? "text-gray-400 cursor-not-allowed" : ""
                    }`}
                    onClick={() =>
                      cartItem.quantity > 1 && cart.decreaseQuantity(cartItem.item._id)
                    }
                  />
                  <p className="text-body-bold">{cartItem.quantity}</p>
                  <PlusCircle
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => cart.increaseQuantity(cartItem.item._id)}
                  />
                </div>

                <Trash
                  className="hover:text-red-1 cursor-pointer"
                  onClick={() => cart.removeItem(cartItem.item._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-1/3 max-lg:w-full flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-5">
        <p className="text-heading4-bold pb-4">
          Summary{" "}
          <span>{`(${cart.cartItems.length} ${
            cart.cartItems.length > 1 ? "items" : "item"
          })`}</span>
        </p>
        <div className="flex justify-between text-body-semibold">
          <span>Total Amount</span>
          <span>ksh {totalRounded}</span>
        </div>
        <button
  className={`border rounded-lg text-body-bold py-3 w-full ${
    showCheckoutForm ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-white hover:bg-black hover:text-white"
  }`}
  onClick={handleCheckoutClick}
  disabled={showCheckoutForm}
>
  {showCheckoutForm ? "Complete the form below" : "Proceed to Checkout"}
</button>


        {showCheckoutForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Billing Details */}
            <h2 className="text-2xl font-semibold mb-6">Billing Details</h2>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} placeholder="Enter your first name" className={errors.firstName ? "border-red-500" : ""} />
              {renderError(errors.firstName)}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} placeholder="Enter your last name" className={errors.lastName ? "border-red-500" : ""} />
              {renderError(errors.lastName)}
            </div>

            <div>
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <Input id="companyName" {...register("companyName")} placeholder="Enter your company name" />
            </div>

            <div>
              <Label htmlFor="townCity">Town/City</Label>
              <Input id="townCity" {...register("townCity")} placeholder="Enter your town or city" className={errors.townCity ? "border-red-500" : ""} />
              {renderError(errors.townCity)}
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" {...register("phoneNumber")} placeholder="Enter your phone number" className={errors.phoneNumber ? "border-red-500" : ""} />
              {renderError(errors.phoneNumber)}
            </div>

            <div>
              <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
              <Textarea id="orderNotes" {...register("orderNotes")} placeholder="Any additional notes for your order" />
            </div>

            {/* Shipping Details */}
            <h2 className="text-2xl font-semibold mb-6">Shipping Details</h2>
            <div>
              <Label htmlFor="shippingMethod">Shipping Method</Label>
              <Select onValueChange={handleShippingMethodChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a shipping method" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(shippingRates).map(([method, cost]) => (
                    <SelectItem key={method} value={method}>
                      {method} - KSh{cost}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {renderError(errors.shippingMethod)}
            </div>

            <div className="pt-4">
              <p className="font-medium">Shipping Cost: KSh{shippingCost}</p>
            </div>
            <div className="pt-4">
              <p className="font-medium">Total with Shipping: KSh{totalRounded + shippingCost}</p>
            </div>
          
            <Paymentinfo/>
            {/* Mpesa Payment Details */}
            <h2 className="text-2xl font-semibold mb-6">Mpesa Payment Details</h2>
            <div>
              <Label htmlFor="mpesaName">Mpesa Name</Label>
              <Input id="mpesaName" {...register("mpesaName")} placeholder="Enter your Mpesa name" className={errors.mpesaName ? "border-red-500" : ""} />
              {renderError(errors.mpesaName)}
            </div>

            <div>
              <Label htmlFor="mobileNumber">Mobile Phone Number</Label>
              <Input id="mobileNumber" {...register("mobileNumber")} placeholder="Enter your mobile number" className={errors.mobileNumber ? "border-red-500" : ""} />
              {renderError(errors.mobileNumber)}
            </div>

            <div>
              <Label htmlFor="transactionCode">Mpesa Transaction Code</Label>
              <Input id="transactionCode" {...register("transactionCode")} placeholder="Enter the transaction code" className={errors.transactionCode ? "border-red-500" : ""} />
              {renderError(errors.transactionCode)}
            </div>

          

            <div className="pt-4">
            <Button
  type="submit"
  className="w-full bg-blue-500 text-white"
  disabled={isSubmitting || cart.cartItems.length === 0} // Disable on submit
>
  {isSubmitting ? "Processing..." : "Place Order"}
</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Cart;