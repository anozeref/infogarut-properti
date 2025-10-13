// import React, { useEffect, useState } from "react";
// import { FaArrowLeft } from "react-icons/fa";

// // enum PropertyType
// const PropertyType = {
//   RUMAH: "RUMAH",
//   APARTEMEN: "APARTEMEN",
//   TANAH: "TANAH",
// };

// // InputField dipindah keluar supaya tidak dibuat ulang tiap render
// const InputField = ({ label, name, type = "text", value, onChange, children }) => (
//   <div>
//     <label htmlFor={name} className="block text-sm font-medium text-slate-700">
//       {label}
//     </label>
//     <div className="mt-1">
//       {children ? (
//         children
//       ) : (
//         <input
//           type={type}
//           name={name}
//           id={name}
//           value={value}
//           onChange={onChange}
//           className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           required={["name", "location", "price"].includes(name)}
//         />
//       )}
//     </div>
//   </div>
// );

// const PropertyForm = ({ onSave, onCancel, initialData }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     location: "",
//     type: PropertyType.RUMAH,
//     buildingArea: "",
//     landArea: "",
//     bedrooms: "",
//     bathrooms: "",
//     imageUrl: "",
//     id: null,
//   });

//   // Set initial data (edit mode) atau random gambar (add mode)
//   useEffect(() => {
//     if (initialData && initialData.id !== formData.id) {
//       setFormData({
//         ...initialData,
//         price: initialData.price?.toString() || "",
//         buildingArea: initialData.buildingArea?.toString() || "",
//         landArea: initialData.landArea?.toString() || "",
//         bedrooms: initialData.bedrooms?.toString() || "",
//         bathrooms: initialData.bathrooms?.toString() || "",
//         id: initialData.id,
//       });
//     } else if (!initialData && !formData.imageUrl) {
//       const randomSeed = Math.random().toString(36).substring(7);
//       setFormData((prev) => ({
//         ...prev,
//         imageUrl: `https://picsum.photos/seed/${randomSeed}/800/600`,
//       }));
//     }
//   }, [initialData, formData.id, formData.imageUrl]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.name || !formData.location || parseFloat(formData.price) <= 0) {
//       alert("Harap isi Nama Properti, Harga, dan Lokasi.");
//       return;
//     }

//     const dataToSave = {
//       ...formData,
//       price: parseFloat(formData.price),
//       buildingArea: parseFloat(formData.buildingArea) || 0,
//       landArea: parseFloat(formData.landArea) || 0,
//       bedrooms: parseInt(formData.bedrooms) || 0,
//       bathrooms: parseInt(formData.bathrooms) || 0,
//       id: formData.id || new Date().toISOString(),
//     };

//     onSave(dataToSave);
//   };

//   const formTitle = formData.id ? "Edit Properti" : "Tambah Properti Baru";

//   return (
//     <div className="max-w-4xl mx-auto">
//       <button
//         onClick={onCancel}
//         className="flex items-center gap-2 mb-6 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
//       >
//         <FaArrowLeft className="w-5 h-5" />
//         Kembali ke Dashboard
//       </button>

//       <div className="bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">
//           {formTitle}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="md:col-span-2">
//               <InputField
//                 label="Nama Properti"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label
//                 htmlFor="description"
//                 className="block text-sm font-medium text-slate-700"
//               >
//                 Deskripsi
//               </label>
//               <textarea
//                 name="description"
//                 id="description"
//                 rows={4}
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>

//             <InputField
//               label="Harga (IDR)"
//               name="price"
//               type="number"
//               value={formData.price}
//               onChange={handleChange}
//             />

//             <InputField
//               label="Lokasi"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//             />

//             <InputField
//               label="Tipe Properti"
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//             >
//               <select
//                 name="type"
//                 id="type"
//                 value={formData.type}
//                 onChange={handleChange}
//                 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//               >
//                 {Object.values(PropertyType).map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>
//             </InputField>

//             <InputField
//               label="URL Gambar"
//               name="imageUrl"
//               value={formData.imageUrl}
//               onChange={handleChange}
//             />

//             <InputField
//               label="Luas Bangunan (m²)"
//               name="buildingArea"
//               type="number"
//               value={formData.buildingArea}
//               onChange={handleChange}
//             />

//             <InputField
//               label="Luas Tanah (m²)"
//               name="landArea"
//               type="number"
//               value={formData.landArea}
//               onChange={handleChange}
//             />

//             <InputField
//               label="Kamar Tidur"
//               name="bedrooms"
//               type="number"
//               value={formData.bedrooms}
//               onChange={handleChange}
//             />

//             <InputField
//               label="Kamar Mandi"
//               name="bathrooms"
//               type="number"
//               value={formData.bathrooms}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="pt-5 flex justify-end gap-4">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-transparent rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
//             >
//               Batal
//             </button>

//             <button
//               type="submit"
//               className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Simpan Properti
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PropertyForm;
