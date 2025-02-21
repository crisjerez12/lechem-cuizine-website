import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";

type PackageReservationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reservationData: any) => void;
  packageName: string;
  packagePrice: number;
};

export default function PackageReservationDialog({
  isOpen,
  onClose,
  onSubmit,
  packageName,
  packagePrice,
}: PackageReservationDialogProps) {
  const [reservationType, setReservationType] = useState<"person" | "agency">(
    "person"
  );
  const [formData, setFormData] = useState({
    fullName: "",
    agencyName: "",
    mobileNumber: "+63",
    agencyContactNumber: "+63",
    pax: "25",
    location: "",
    notes: "",
    choices: "",
    reservationDate: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^\d+]/g, "");
    if (numericValue.startsWith("+63") && numericValue.length <= 13) {
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    }
  };

  const handleSubmit = () => {
    if (!formData.reservationDate) {
      toast.error("Please select a date for your reservation");
      return;
    }

    if (!formData.location || !formData.pax) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      reservationType === "person" &&
      (!formData.fullName || !formData.mobileNumber)
    ) {
      toast.error(
        "Please fill in all required fields for personal reservation"
      );
      return;
    }

    if (
      reservationType === "agency" &&
      (!formData.agencyName || !formData.agencyContactNumber)
    ) {
      toast.error("Please fill in all required fields for agency reservation");
      return;
    }

    const reservationData = {
      name:
        reservationType === "person" ? formData.fullName : formData.agencyName,
      mobile_number:
        reservationType === "person"
          ? formData.mobileNumber
          : formData.agencyContactNumber,
      pax: formData.pax,
      location: formData.location,
      notes: formData.notes || "N/A",
      choices: formData.choices || "N/A",
      reservation_date: formData.reservationDate,
      package: packageName,
      total_price: packagePrice,
    };

    onSubmit(reservationData);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-poppins font-medium">
            Complete Reservation
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow p-4">
          <div className="space-y-4">
            <div className="flex border-b border-gray-200">
              <button
                className={`py-2 px-4 ${
                  reservationType === "person"
                    ? "border-b-2 border-secondary text-secondary"
                    : "text-gray-500"
                }`}
                onClick={() => setReservationType("person")}
              >
                Person
              </button>
              <button
                className={`py-2 px-4 ${
                  reservationType === "agency"
                    ? "border-b-2 border-secondary text-secondary"
                    : "text-gray-500"
                }`}
                onClick={() => setReservationType("agency")}
              >
                Agency
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Reservation
              </label>
              <input
                type="date"
                name="reservationDate"
                value={formData.reservationDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {reservationType === "person" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[0-9]/g, "");
                      setFormData((prev) => ({ ...prev, fullName: value }));
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handlePhoneChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="+639XXXXXXXXX"
                    pattern="\+63[0-9]{10}"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agency Name
                  </label>
                  <input
                    type="text"
                    name="agencyName"
                    value={formData.agencyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="Enter agency name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agency Contact Number
                  </label>
                  <input
                    type="tel"
                    name="agencyContactNumber"
                    value={formData.agencyContactNumber}
                    onChange={handlePhoneChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="+639XXXXXXXXX"
                    pattern="\+63[0-9]{10}"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Pax
              </label>
              <input
                type="number"
                name="pax"
                value={formData.pax}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value);
                  setFormData((prev) => ({ ...prev, pax: value.toString() }));
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Enter number of pax (minimum 25)"
                min="25"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Enter your full location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Any allergies? or notes?
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="e.g. allergic to shrimps"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Choices
              </label>
              <textarea
                name="choices"
                value={formData.choices}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="e.g. Adobo, Sisig, Fried Chicken"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="border-t p-4">
          <button
            onClick={handleSubmit}
            className="w-full btn bg-secondary text-white"
          >
            Make Reservation
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
