"use client"

import Loader from "@/components/Loader"
import ProductCard from "@/components/ProductCard"
import { getProductDetails } from "@/lib/actions/actions"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

const Wishlist = () => {
  const { user } = useUser()

  const [loading, setLoading] = useState(true)
  const [signedInUser, setSignedInUser] = useState<UserType | null>(null)
  const [wishlist, setWishlist] = useState<ProductType[]>([])

  const getUser = async () => {
    try {
      const res = await fetch("/api/users")
      const data = await res.json()
      setSignedInUser(data)
      setLoading(false)
    } catch (err) {
      console.log("[users_GET]", err)
    }
  }

  useEffect(() => {
    if (user) {
      getUser()
    }
  }, [user])

  const getWishlistProducts = async () => {
    setLoading(true)

    if (!signedInUser) return

    // Ensure wishlist is treated as an array
    const wishlistArray = signedInUser.wishlist as string[] // or ProductType[] depending on the type you're expecting

    // Handle empty wishlist
    if (wishlistArray.length === 0) {
      setWishlist([]) // Clear wishlist if empty
      setLoading(false) // Stop loading
      return
    }

    try {
      const wishlistProducts = await Promise.all(
        wishlistArray.map(async (productId) => {
          const res = await getProductDetails(productId)
          return res
        })
      )

      setWishlist(wishlistProducts) // Set the wishlist with product details
    } catch (err) {
      console.log("[getWishlistProducts] Error:", err)
    } finally {
      setLoading(false) // Stop loading in any case
    }
  }

  useEffect(() => {
    if (signedInUser) {
      getWishlistProducts()
    }
  }, [signedInUser])

  const updateSignedInUser = (updatedUser: UserType) => {
    setSignedInUser(updatedUser)
  }

  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <p className="text-heading3-bold my-10">Your Wishlist</p>
      {wishlist.length === 0 && (
        <p>No items in your wishlist</p>
      )}

      <div className="flex flex-wrap justify-center gap-16">
        {wishlist.map((product) => (
          <ProductCard key={product._id} product={product} updateSignedInUser={updateSignedInUser} />
        ))}
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic";

export default Wishlist
