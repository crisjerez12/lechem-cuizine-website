import { useState } from "react";
import { motion } from "framer-motion";
import { X, Info } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import PackageReservationDialog from "../components/PackageReservationDialog ";
import { useOffers } from "../context/OffersContext";
import { Packages } from "../lib/type";
import supabase from "../lib/supabase";
import { generatePDF } from "../components/generatePDF";

export default function OffersPage() {
  const [expandedDescriptions, setExpandedDescriptions] = useState<number[]>(
    []
  );
  const [selectedPackage, setSelectedPackage] = useState<Packages | null>(null);
  const [showInclusionsDialog, setShowInclusionsDialog] = useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [customBudget, setCustomBudget] = useState("");
  const { occasions } = useOffers() as { occasions: Packages[] };
  const toggleDescription = (id: number) => {
    setExpandedDescriptions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const truncateText = (text: string, limit: number) => {
    const words = text.split(" ");
    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + "...";
    }
    return text;
  };

  const handleShowInclusions = (occasion: Packages) => {
    setSelectedPackage(occasion);
    setShowInclusionsDialog(true);
  };

  const handleChoosePackage = (occasion: Packages) => {
    setSelectedPackage(occasion);
    setCustomBudget(occasion.min_price.toString());
    setShowBudgetDialog(true);
  };

  const handleSubmitBudget = () => {
    const budget = Number.parseFloat(customBudget);
    const min_price = selectedPackage?.min_price || 0;

    if (budget < +min_price) {
      toast.error(`Budget must be at least ₱${min_price.toLocaleString()}`);
      return;
    }

    setShowBudgetDialog(false);
    setShowReservationDialog(true);
  };

  const handleReservationSubmit = async (reservationData: any) => {
    console.log(reservationData);
    const { data, error } = await supabase
      .from("online_reservations")
      .insert(reservationData)
      .select("*");
    if (error) {
      toast.error("Reservation Failed to submit!");
      return;
    }
    toast.success("Reservation submitted successfully!");
    await generatePDF(data[0]);
    setShowReservationDialog(false);
    setSelectedPackage(null);
  };

  return (
    <div className="py-20 px-4">
      <Toaster position="top-right" />
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="visible"
        className="container mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-fredoka text-center mb-16">
          Our Offers
        </h1>

        <section className="mb-16">
          <div className="space-y-6">
            {occasions.map((occasion) => (
              <motion.div
                key={occasion.id}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
                className="card overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3">
                    <img
                      src={occasion.image || "/placeholder.svg"}
                      alt={occasion.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="p-4 md:p-6 w-full md:w-2/3">
                    <h3 className="text-lg md:text-xl font-poppins font-medium mb-2">
                      {occasion.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-4">
                      {expandedDescriptions.includes(occasion.id)
                        ? occasion.description
                        : truncateText(occasion.description, 30)}
                      <button
                        onClick={() => toggleDescription(occasion.id)}
                        className="ml-2 text-secondary hover:text-secondary/80"
                      >
                        {expandedDescriptions.includes(occasion.id)
                          ? "See less"
                          : "See more"}
                      </button>
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {occasion.attributes.map((attr, index) => (
                        <span
                          key={index}
                          className="px-2 md:px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs md:text-sm"
                        >
                          {attr}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleShowInclusions(occasion)}
                      className="flex items-center text-blue-600 hover:text-blue-600/80 mb-4"
                    >
                      <Info className="w-4 h-4 mr-1" />
                      <span className="text-sm">This package includes</span>
                    </button>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-xl md:text-2xl font-bold text-primary">
                          &#8369; {occasion.price.toLocaleString()}
                        </span>
                        <p className="text-xs md:text-sm text-gray-600">
                          Starting from &#8369;
                          {occasion.min_price.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleChoosePackage(occasion)}
                        className="w-full sm:w-auto btn bg-secondary text-white text-sm md:text-base"
                      >
                        Choose
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Inclusions Dialog */}
        {showInclusionsDialog && selectedPackage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-poppins font-medium">
                  {selectedPackage.title} Inclusions
                </h3>
                <button
                  onClick={() => setShowInclusionsDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Desserts:</h4>
                <ul className="list-disc list-inside mb-4">
                  {selectedPackage.desserts.map((dessert, index) => (
                    <li key={index}>{dessert}</li>
                  ))}
                </ul>
                <h4 className="font-medium mb-2">Foods:</h4>
                <ul className="list-disc list-inside mb-4">
                  {selectedPackage.foods.map((food, index) => (
                    <li key={index}>{food}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setShowInclusionsDialog(false)}
                className="w-full btn bg-secondary text-white text-sm md:text-base mt-4"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Budget Dialog */}
        {showBudgetDialog && selectedPackage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-poppins font-medium">
                  Set Your Budget
                </h3>
                <button
                  onClick={() => setShowBudgetDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package: {selectedPackage.title}
                  </label>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() =>
                        setCustomBudget(selectedPackage.min_price.toString())
                      }
                      className="flex-1 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-sm md:text-base"
                    >
                      Minimum (&#8369;
                      {selectedPackage.min_price.toLocaleString()})
                    </button>
                    <button
                      onClick={() =>
                        setCustomBudget(selectedPackage.price.toString())
                      }
                      className="flex-1 px-3 py-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 text-sm md:text-base"
                    >
                      Standard (&#8369;{selectedPackage.price.toLocaleString()})
                    </button>
                  </div>
                  <input
                    type="number"
                    value={customBudget}
                    onChange={(e) => setCustomBudget(e.target.value)}
                    min={selectedPackage.min_price.toString()}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="Enter your budget"
                  />
                </div>
                <button
                  onClick={handleSubmitBudget}
                  className="w-full btn bg-secondary text-white text-sm md:text-base"
                >
                  Confirm Budget
                </button>
              </div>
            </div>
          </div>
        )}

        <PackageReservationDialog
          isOpen={showReservationDialog}
          onClose={() => setShowReservationDialog(false)}
          onSubmit={handleReservationSubmit}
          packageName={selectedPackage?.title || ""}
          packagePrice={Number(customBudget)}
        />
      </motion.div>
    </div>
  );
}
