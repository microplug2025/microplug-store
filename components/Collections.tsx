import { getCollections } from "@/lib/actions/actions";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

const Collections = async () => {
  const collections = await getCollections();

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5 overflow-hidden">
      <p className="text-heading1-bold">Main categories</p>
      {!collections || collections.length === 0 ? (
        <p className="text-body-bold">No main categories found</p>
      ) : (
        <>
          {/* Scrollable Collections Section */}
          <div className="relative w-full max-w-7xl overflow-hidden">
            <div
              id="scroll-container"
              className="flex w-max animate-scroll whitespace-nowrap items-center"
            >
              {[...collections, ...collections].map((collection, index) => (
                <Link
                  href={`/collections/${collection._id}`}
                  key={`${collection._id}-${index}`}
                  className="shrink-0 px-4 flex flex-col items-center justify-center"
                >
                  <div className="h-[180px] w-[250px] flex items-center justify-center overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      width={250}
                      height={180}
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <span className="block text-center text-blue-600 text-3xl font-bold mt-2">
                    {collection.title}
                  </span>
                  <div className="flex items-center gap-2 text-gray-600 text-lg mt-1 hover:text-blue-600">
                    <span>View category</span>
                    <ArrowRight size={20} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Enlarged Dropdown for All Collections */}
          <div className="relative mt-5 w-full max-w-4xl">
            <details className="group w-full">
              <summary className="flex items-center justify-between bg-gray-100 text-gray-700 px-6 py-3 rounded-lg cursor-pointer select-none hover:bg-gray-200">
                <span className="font-semibold text-lg text-center">Show All main categories</span>
                <ChevronDown size={22} className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-2 border border-gray-300 rounded-lg bg-white shadow-md p-5 grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                {[...collections, ...collections].map((collection, index) => (
                  <Link
                    href={`/collections/${collection._id}`}
                    key={`${collection._id}-${index}`}
                    className="flex items-center gap-4 hover:bg-gray-100 p-3 rounded-lg"
                  >
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                    <span className="font-semibold text-lg">{collection.title}</span>
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </>
      )}
    </div>
  );
};

export default Collections;
