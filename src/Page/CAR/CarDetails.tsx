import React from "react";
import { useParams } from "react-router-dom";
import { useGetSingleCarQuery } from "../../redux/feature/adminApi";
import { Loader2, CarFront, MapPin, User, CreditCard, CalendarDays, Wrench } from "lucide-react";

const CarDetails: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const { data, isLoading, isError } = useGetSingleCarQuery(carId!, { skip: !carId });
  const car = data?.data; 
  console.log(car);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-indigo-600">
        <Loader2 className="animate-spin mr-2" size={26} />
        Loading Car Details...
      </div>
    );
  }

  if (isError || !car) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 font-semibold">
        ❌ Failed to load car details
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-linear-to-r from-indigo-600 to-blue-500 p-6 text-white flex items-center justify-between">
          <div>
             <h2 className="text-3xl font-bold">{car.brand?.title} - {car.model?.title}</h2>
            <p className="text-sm opacity-80 mt-1">VIN: {car.vin || "Not Available"}</p>
          </div>
          <CarFront size={44} className="opacity-90" />
          
        </div>


        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-800">
          <DetailCard title="Brand" value={car.brand?.title} icon={<CarFront className="text-indigo-500" />} />
          <DetailCard title="Model" value={car.model?.title} icon={<Wrench className="text-indigo-500" />} />
          <DetailCard title="Year" value={car.year} icon={<CalendarDays className="text-indigo-500" />} />
          <DetailCard title="VIN" value={car.vin} icon={<CreditCard className="text-indigo-500" />} />
          <DetailCard title="Client Name" value={car.client?.clientId?.name || car.client?.name} icon={<User className="text-indigo-500" />} />
          <DetailCard title="Car Type" value={car.carType} icon={<CarFront className="text-indigo-500" />} />

          <DetailCard
            title="Plate Number"
            value={
              car.carType === "International"
                ? car.plateNumberForInternational
                : car.carType === "Saudi"
                ? car.plateNumberForSaudi?.numberEnglish
                : "Not Available"
            }
            icon={<CreditCard className="text-indigo-500" />}
          />

          <DetailCard title="PlateNumber" value={car.slugForSaudiCarPlateNumber} icon={<MapPin className="text-indigo-500" />} />
          <DetailCard title="Longitude" value={car.longitude} icon={<MapPin className="text-indigo-500" />} />
          <DetailCard title="Address" value={car.address} icon={<MapPin className="text-indigo-500" />} />
          
        </div>
      </div>
    </div>
  );
};

interface DetailCardProps {
  title: string;
  value: string | number | boolean | undefined;
  icon?: React.ReactNode;
}

const DetailCard: React.FC<DetailCardProps> = ({ title, value, icon }) => (
  <div className="flex items-start bg-gray-50 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
    <div className="mr-4">{icon}</div>
    <div>
      <h4 className="text-sm text-gray-500 uppercase font-semibold tracking-wide">{title}</h4>
      <p className="text-gray-800 font-medium mt-1">{value || "Not Available"}</p>
    </div>
  </div>
);

export default CarDetails;
