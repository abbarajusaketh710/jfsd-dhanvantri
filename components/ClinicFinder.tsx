import React, { useState } from 'react';
import { Clinic } from '../types';
import { MapPin, Phone, Star, Navigation, Calendar, ArrowLeft, Search } from 'lucide-react';

interface Props {
  onBack: () => void;
  userLocation?: string;
}

const MOCK_CLINICS: Clinic[] = [
  {
    id: '1',
    name: "Apollo Heart Institute",
    address: "123 Healthcare Blvd, Metro City",
    phone: "+1 (555) 123-4567",
    specialties: ["Cardiology", "Hypertension"],
    distance: "1.2 km",
    rating: 4.8,
    isOpen: true
  },
  {
    id: '2',
    name: "City Diabetes Care Center",
    address: "45 Wellness Way, Downtown",
    phone: "+1 (555) 987-6543",
    specialties: ["Endocrinology", "Nutrition"],
    distance: "2.5 km",
    rating: 4.5,
    isOpen: true
  },
  {
    id: '3',
    name: "General Wellness Clinic",
    address: "78 Community Rd, Suburbia",
    phone: "+1 (555) 246-8101",
    specialties: ["General Medicine", "Preventive Care"],
    distance: "5.0 km",
    rating: 4.2,
    isOpen: false
  },
  {
    id: '4',
    name: "Elite Physio & Rehab",
    address: "12 Sport Complex, Metro City",
    phone: "+1 (555) 111-2222",
    specialties: ["Physiotherapy", "Rehabilitation"],
    distance: "3.1 km",
    rating: 4.9,
    isOpen: true
  }
];

const ClinicFinder: React.FC<Props> = ({ onBack, userLocation }) => {
  const [searchTerm, setSearchTerm] = useState(userLocation || '');
  const [filter, setFilter] = useState('All');

  const filteredClinics = MOCK_CLINICS.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          clinic.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || clinic.specialties.some(s => s.includes(filter));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="mb-8 flex items-center">
        <button onClick={onBack} className="mr-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
            <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
            <h1 className="text-2xl font-bold text-white">Find Care</h1>
            <p className="text-gray-400 text-sm">Discover top-rated providers near you.</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
            <input 
                type="text" 
                placeholder="Search clinic or location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            />
        </div>
        <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none cursor-pointer"
        >
            <option value="All">All Specialties</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Endocrinology">Diabetes/Endo</option>
            <option value="General">General Medicine</option>
            <option value="Physiotherapy">Physiotherapy</option>
        </select>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClinics.map(clinic => (
            <div key={clinic.id} className="bg-gray-900/60 backdrop-blur border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 rounded-2xl p-6 flex flex-col justify-between group">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition">{clinic.name}</h3>
                        {clinic.isOpen ? (
                            <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs rounded-full border border-emerald-800">Open Now</span>
                        ) : (
                            <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-full border border-red-800">Closed</span>
                        )}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                        {clinic.address} • <span className="text-cyan-500 ml-1">{clinic.distance}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {clinic.specialties.map((s, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700">{s}</span>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                     <div className="flex items-center text-yellow-500 font-bold">
                        <Star className="w-4 h-4 fill-current mr-1" /> {clinic.rating}
                    </div>
                    <div className="flex space-x-2">
                        <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white border border-gray-700" title="Call">
                            <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white border border-gray-700" title="Directions">
                            <Navigation className="w-4 h-4" />
                        </button>
                        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white text-sm font-medium">
                            Book
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>
      
      {filteredClinics.length === 0 && (
          <div className="text-center py-12">
              <p className="text-gray-500">No clinics found matching your criteria.</p>
          </div>
      )}

      {/* Integration Notice */}
      <div className="mt-8 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 flex items-start space-x-3">
        <div className="p-2 bg-blue-900/20 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-400" />
        </div>
        <div>
            <h4 className="text-sm font-bold text-gray-200">Seamless Integration</h4>
            <p className="text-xs text-gray-400 mt-1">Bookings made through Dhanvantri are automatically synced with your personal health calendar and medical history log.</p>
        </div>
      </div>
    </div>
  );
};

export default ClinicFinder;
