import { createBrowserRouter } from "react-router";
import AdminLayout from "../AdminDashBoard/layout/AdminLayout";
import Dashboard from "../Components/Dashboard";
import Login from "../Page/Login";
import CreateAdmin from "../Page/CreateAdmin";
import MessageList from "../Page/Message";
import CarBrandComponent from "../Page/CARBRAND/Brand";
import CreateCarBrand from "../Page/CARBRAND/createCar";
import CarModelTable from "../Page/CARMODEL/carModelTable";
import CreateCarModel from "../Page/CARMODEL/CreateCarModel";
import CarBrandDetail from "../Page/CARBRAND/Details";
import WorkShop from "../Page/workShop/workShop";
import WorkShopDetails from "../Page/workShop/workShopDetails";
import Cars from "../Page/CAR/GetAllCar";
import CarDetails from "../Page/CAR/CarDetails";
import UpdateWorkShop from "../Page/workShop/UpdateWorkShop";
import Profile from "../Page/Profile";
import CreateCarImage from "../Page/IMAGE/CreateCarImage";
import UpdateImage from "../Page/IMAGE/updateImage";
import WorkList from "../Page/WORK/workList";
import ProtectedRoute from "../Page/ProtectedRoute";
import ErrorPage from "../Page/ErrorPage";
import PrivacyPolicy from "../Page/Setting/PrivacyPolicy";
import AboutUs from "../Page/Setting/AboutUs";
import Support from "../Page/Setting/Support";
import Service from "../Page/Setting/Service";
import AccountDelete from "../Page/Setting/AccountDelete";
import WorkFromOrFileUpload from "../Page/WORK/workHome";
import SpareFromOrFileUpload from "../Page/SPARE/SpareHome";
import SparePartsList from "../Page/SPARE/SpareList";
import { CreateCountry } from "../Page/CARBRAND/CreateCountry";
import PackageTable from "../Page/PACKAGE/AllPackage";
import AllSubscription from "../Page/PACKAGE/AllSubscription";
import UpdatePackageForm from "../Page/PACKAGE/UpdatePackage";
import CreateDiscount from "../Page/DISCOUNT/CreateDiscount";
import CouponCards from "../Page/DISCOUNT/GetDiscount";
import UpdateDiscount from "../Page/DISCOUNT/UpdateDisCount";

const Routes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "admin/dashboard", element: <Dashboard /> },
          { path: "admin/profile", element: <Profile /> },
          { path: "admin/createAdmin", element: <CreateAdmin /> },
          { path: "admin/message", element: <MessageList /> },
          { path: "admin/brand", element: <CarBrandComponent /> },
          { path: "country", element: <CreateCountry /> },
          { path: "admin/carmodel", element: <CarModelTable /> },
          { path: "admin/details/:id", element: <CarBrandDetail /> },
          { path: "admin/package", element: <PackageTable /> },
          { path: "admin/Subscription", element: <AllSubscription /> },
          // WORK
          { path: "admin/workShop", element: <WorkShop /> },
          { path: "admin/workList", element: <WorkList /> },
          { path: "admin/addWork", element: <WorkFromOrFileUpload /> },
          { path: "admin/Spare", element: <SparePartsList /> },
          { path: "admin/createSpare", element: <SpareFromOrFileUpload /> },
          { path: "admin/car", element: <Cars /> },
          // DISCOUNT
          { path: "admin/cupon", element: <CouponCards /> },
          { path: "admin/createCupon", element: <CreateDiscount /> },
          { path: "updateCoupon/:id", element: <UpdateDiscount /> },
          // Setting
          { path: "admin/privacy-policy", element: <PrivacyPolicy /> },
          { path: "admin/about-us", element: <AboutUs /> },
          { path: "admin/support", element: <Support /> },
          { path: "admin/service", element: <Service /> },
          { path: "admin/account-delete", element: <AccountDelete /> },
          { path: "createCarBrand", element: <CreateCarBrand /> },
          { path: "createCarmodel", element: <CreateCarModel /> },
          { path: "model", element: <CreateCarModel /> },
          { path: "imageType", element: <CreateCarImage /> },
          { path: "image/edit/:id", element: <UpdateImage /> },
          { path: "UpdateWorkShop/:workshopId", element: <UpdateWorkShop /> },
          { path: "workShopDetails/:workShopId", element: <WorkShopDetails /> },
          { path: "updatePackage/:id", element: <UpdatePackageForm /> },
          { path: "carDetails/:carId", element: <CarDetails /> },
        ],
      },
    ],
  },
]);

export default Routes;
