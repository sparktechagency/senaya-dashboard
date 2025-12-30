import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"
import { useGetSingleWorkShopQuery, useUpdateWorkShopMutation } from "../../redux/feature/adminApi"

interface WorkshopFormData {
  workshopNameEnglish: string
  workshopNameArabic: string
  unn: string
  crn: string
  mln: string
  address: string
  contact: string
  taxVatNumber: string
  bankAccountNumber: string
  name: string
  isAvailableMobileWorkshop: boolean
  regularStartDay: string
  regularEndDay: string
  regularStartTime: string
  regularEndTime: string
  ramadanStartDay: string
  ramadanEndDay: string
  ramadanStartTime: string
  ramadanEndTime: string
  latitude: number
  longitude: number
  preferredLanguage: string
  nationality: string
  image?: FileList
}

const daysOfWeek = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const languages = ["en", "bn", "ar", "ur", "hi", "tl"]

const UpdateWorkShop: React.FC = () => {
  const { workshopId } = useParams<{ workshopId: string }>()
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState<string>("owner")
  const [preferredLanguage, setPreferredLanguage] = useState<string>("en")
  const [nationality, setNationality] = useState<string>("")

  const { data, isLoading, isError } = useGetSingleWorkShopQuery(workshopId || "")
  console.log(data?.data)
  const [updateWorkshop, { isLoading: isUpdating }] = useUpdateWorkShopMutation()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<WorkshopFormData>()

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "owner"
    setUserRole(role)
  }, [])

  useEffect(() => {
    if (data?.data) {
      const ws = data.data
      reset({
        workshopNameEnglish: ws.workshopNameEnglish || "",
        workshopNameArabic: ws.workshopNameArabic || "",
        unn: ws.unn || "",
        crn: ws.crn || "",
        mln: ws.mln || "",
        name: ws.ownerId?.name || "",
        address: ws.address || "",
        contact: ws.contact || "",
        taxVatNumber: ws.taxVatNumber || "",
        bankAccountNumber: ws.bankAccountNumber || "",
        isAvailableMobileWorkshop: Boolean(ws.isAvailableMobileWorkshop),
        regularStartDay: ws.regularWorkingSchedule?.startDay || "Saturday",
        regularEndDay: ws.regularWorkingSchedule?.endDay || "Friday",
        regularStartTime: ws.regularWorkingSchedule?.startTime || "",
        regularEndTime: ws.regularWorkingSchedule?.endTime || "",
        ramadanStartDay: ws.ramadanWorkingSchedule?.startDay || "Saturday",
        ramadanEndDay: ws.ramadanWorkingSchedule?.endDay || "Thursday",
        ramadanStartTime: ws.ramadanWorkingSchedule?.startTime || "",
        ramadanEndTime: ws.ramadanWorkingSchedule?.endTime || "",
        latitude: ws.workshopGEOlocation?.coordinates?.[1] ?? 0,
        longitude: ws.workshopGEOlocation?.coordinates?.[0] ?? 0
      })
      if (ws.preferredLanguage && languages.includes(ws.preferredLanguage)) setPreferredLanguage(ws.preferredLanguage)
      if (ws.nationality) setNationality(ws.nationality)
    }
  }, [data, reset])

  const isFieldEditable = (field: string): boolean => {
    if (userRole === "admin") return true
    const ownerEditableFields = [
      "workshopNameEnglish", "workshopNameArabic", "name", "address", "isAvailableMobileWorkshop",
      "regularStartDay", "regularEndDay", "regularStartTime", "regularEndTime",
      "ramadanStartDay", "ramadanEndDay", "ramadanStartTime", "ramadanEndTime"
    ]
    return ownerEditableFields.includes(field)
  }

  const onSubmit = async (formData: WorkshopFormData) => {
    const formDataToSend = new FormData()
    let dataObject: any

    if (userRole === "admin") {
      dataObject = {
        workshopNameEnglish: formData.workshopNameEnglish,
        workshopNameArabic: formData.workshopNameArabic,
        address: formData.address,
        contact: formData.contact,
        taxVatNumber: formData.taxVatNumber,
        name: formData.name,
        isAvailableMobileWorkshop: formData.isAvailableMobileWorkshop,
        regularWorkingSchedule: {
          startDay: formData.regularStartDay,
          endDay: formData.regularEndDay,
          startTime: formData.regularStartTime,
          endTime: formData.regularEndTime
        },
        ramadanWorkingSchedule: {
          startDay: formData.ramadanStartDay,
          endDay: formData.ramadanEndDay,
          startTime: formData.ramadanStartTime,
          endTime: formData.ramadanEndTime
        },
        preferredLanguage, nationality
      }
    } else {
      dataObject = {
        workshopNameEnglish: formData.workshopNameEnglish,
        workshopNameArabic: formData.workshopNameArabic,
        name: formData.name,
        address: formData.address,
        unn: formData.unn,
        crn: formData.crn,
        bankAccountNumber: formData.bankAccountNumber,
        mln: formData.mln,
        taxVatNumber: formData.taxVatNumber,
        contact: formData.contact,
        workshopGEOlocation: {
          type: "Point",
          coordinates: [
            parseFloat(formData.longitude.toString()),
            parseFloat(formData.latitude.toString())
          ]
        },
        isAvailableMobileWorkshop: formData.isAvailableMobileWorkshop,
        regularWorkingSchedule: {
          startDay: formData.regularStartDay,
          endDay: formData.regularEndDay,
          startTime: formData.regularStartTime,
          endTime: formData.regularEndTime
        },
        ramadanWorkingSchedule: {
          startDay: formData.ramadanStartDay,
          endDay: formData.ramadanEndDay,
          startTime: formData.ramadanStartTime,
          endTime: formData.ramadanEndTime
        },
        preferredLanguage, nationality
      }
    }

    formDataToSend.append("data", JSON.stringify(dataObject))
    if (userRole === "admin" && formData.image && formData.image.length > 0) {
      formDataToSend.append("image", formData.image[0])
    }

    try {
      await updateWorkshop({ id: workshopId || "", payload: formDataToSend }).unwrap()
      toast.success("Workshop updated successfully")
      navigate("/admin/workShop")
    } catch (error: any) {
      toast.error(error?.data?.message || "Update failed")
      console.error("Update error:", error)
    }
  }

  if (isLoading) return <div className="flex justify-center items-center min-h-screen text-indigo-600"><Loader2 className="animate-spin mr-2" size={24} /> Loading workshop data...</div>
  if (isError) return <div className="text-center text-red-500 mt-10">Failed to fetch workshop details</div>

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Update Workshop {userRole === "owner" ? "(Owner View)" : ""}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Workshop Names */}
          <div className="flex gap-2">
            <div>
              <label className="font-semibold text-gray-700">Workshop Name (English) *</label>
              <input {...register("workshopNameEnglish", { required: true })} disabled={!isFieldEditable("workshopNameEnglish")} className={`w-full border rounded-lg px-3 py-2 ${!isFieldEditable("workshopNameEnglish") ? "bg-gray-100 cursor-not-allowed" : ""}`} />
              {errors.workshopNameEnglish && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
            <div>
              <label className="font-semibold text-gray-700">Workshop Name (Arabic) *</label>
              <input {...register("workshopNameArabic", { required: true })} disabled={!isFieldEditable("workshopNameArabic")} className={`w-full border rounded-lg px-3 py-2 ${!isFieldEditable("workshopNameArabic") ? "bg-gray-100 cursor-not-allowed" : ""}`} />
              {errors.workshopNameArabic && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
          </div>

          {/* Owner Name */}
          <div>
            <label className="font-semibold text-gray-700">Creator Name *</label>
            <input {...register("name", { required: true })} disabled={!isFieldEditable("name")} className={`w-full border rounded-lg px-3 py-2 ${!isFieldEditable("name") ? "bg-gray-100 cursor-not-allowed" : ""}`} />
            {errors.name && <span className="text-red-500 text-sm">This field is required</span>}
          </div>
          {/* Phone Number */}
          <div>
            <label className="font-semibold text-gray-700">Phone Number *</label>
            <input {...register("contact", { required: true })} className={`w-full border rounded-lg px-3 py-2 ${!isFieldEditable("contact") ? "bg-gray-100 cursor-not-allowed" : ""}`} />
            {errors.contact && <span className="text-red-500 text-sm">This field is required</span>}
          </div>
          {/* Text Vet Number */}
          <div className="flex gap-2">
            <div>
              <label className="font-semibold text-gray-700">Text VAT Number *</label>
              <input {...register("taxVatNumber", { required: true })} className={`w-full border rounded-lg px-3 py-2 ${!isFieldEditable("taxVatNumber") ? "bg-gray-100 cursor-not-allowed" : ""}`} />
              {errors.taxVatNumber && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
            <div>
              <label className="font-semibold text-gray-700">Bank Account Number *</label>
              <input {...register("bankAccountNumber", { required: true })} className={`w-full border rounded-lg px-3 py-2 ${!isFieldEditable("bankAccountNumber") ? "bg-gray-100 cursor-not-allowed" : ""}`} />
              {errors.bankAccountNumber && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
          </div>
          {/* UNN CNN MLN */}
          <div className="flex gap-2">
            <div>
              <label className="font-semibold text-gray-700">UNN *</label>
              <input {...register("unn", { required: true })} className={`w-full border rounded-lg px-3 py-2 ${!isFieldEditable("unn") ? "bg-gray-100 cursor-not-allowed" : ""}`} />
              {errors.unn && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
            <div>
              <label className="font-semibold text-gray-700">CRN *</label>
              <input {...register("crn", { required: true })} className={`w-full border rounded-lg px-3 py-2 ${!isFieldEditable("crn") ? "bg-gray-100 cursor-not-allowed" : ""}`} />
              {errors.crn && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
            <div>
              <label className="font-semibold text-gray-700">MLN *</label>
              <input {...register("mln", { required: true })} className={`w-full border rounded-lg px-3 py-2 ${!isFieldEditable("mln") ? "bg-gray-100 cursor-not-allowed" : ""}`} />
              {errors.mln && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
          </div>
          <div className="flex gap-2">
            {/* Address & Mobile Workshop */}
            <div>
              <label className="font-semibold text-gray-700">Address *</label>
              <input {...register("address", { required: true })} placeholder="Address" className="w-full border rounded-lg px-3 py-2" />
              {errors.address && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
            <div>
              <label className="font-semibold text-gray-700">longitude  *</label>
              <input {...register("longitude", { required: true })} placeholder="Address" className="w-full border rounded-lg px-3 py-2" />
              {errors.longitude && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
            <div>
              <label className="font-semibold text-gray-700">latitude *</label>
              <input {...register("latitude", { required: true })} placeholder="Address" className="w-full border rounded-lg px-3 py-2" />
              {errors.latitude && <span className="text-red-500 text-sm">This field is required</span>}
            </div>

          </div>

          {/* Mobile Workshop */}
          <div className="flex gap-2 items-center">
            <input type="checkbox" {...register("isAvailableMobileWorkshop")} id="mobileWorkshop" />
            <label htmlFor="mobileWorkshop">Mobile Workshop Available</label>
          </div>

          {/* Regular Schedule */}
          <h3 className="text-indigo-700 font-semibold mt-4">Regular Schedule</h3>
          <div className="grid grid-cols-2 gap-3">
            <select {...register("regularStartDay")} className="w-full border rounded-lg px-3 py-2">{daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}</select>
            <select {...register("regularEndDay")} className="w-full border rounded-lg px-3 py-2">{daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}</select>
            <input type="time" {...register("regularStartTime")} className="w-full border rounded-lg px-3 py-2" />
            <input type="time" {...register("regularEndTime")} className="w-full border rounded-lg px-3 py-2" />
          </div>

          {/* Ramadan Schedule */}
          <h3 className="text-indigo-700 font-semibold mt-4">Ramadan Schedule</h3>
          <div className="grid grid-cols-2 gap-3">
            <select {...register("ramadanStartDay")} className="w-full border rounded-lg px-3 py-2">{daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}</select>
            <select {...register("ramadanEndDay")} className="w-full border rounded-lg px-3 py-2">{daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}</select>
            <input type="time" {...register("ramadanStartTime")} className="w-full border rounded-lg px-3 py-2" />
            <input type="time" {...register("ramadanEndTime")} className="w-full border rounded-lg px-3 py-2" />
          </div>

          {/* Preferred Language & Nationality */}
          <div className="grid grid-cols-2 gap-3">
            <select value={preferredLanguage} onChange={e => setPreferredLanguage(e.target.value)} className="w-full border rounded-lg px-3 py-2">
              {languages.map(lang => <option key={lang} value={lang}>{lang.toUpperCase()}</option>)}
            </select>
            <input type="text" value={nationality} onChange={e => setNationality(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="Nationality" />
          </div>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={isUpdating} type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-6 font-semibold flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition">
            {isUpdating && <Loader2 size={18} className="animate-spin" />} {isUpdating ? "Updating..." : "Update Workshop"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default UpdateWorkShop
