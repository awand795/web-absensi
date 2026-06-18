import React, { useEffect, useState } from "react";
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiNavigation, FiLoader } from 'react-icons/fi';
import api from '../../api/axios';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from '../../lib/leafletSetup';

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

function MapClickHandler({ onMapClick }) {
    useMapEvents({ click: (e) => onMapClick(e.latlng) });
    return null;
}

function MapCenter({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, 16);
    }, [center, map]);
    return null;
}

const LocationManagement = () => {
    const [locations, setLocations] = useState([]);
    const [form, setForm] = useState({ name: '', latitude: '', longitude: '', radius: 100 });
    const [editing, setEditing] = useState(null);
    const [gettingGps, setGettingGps] = useState(false);
    const [mapCenter, setMapCenter] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchLocations = async () => {
        try {
            const res = await api.get('/locations');
            setLocations(res.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchLocations(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await api.put(`/admin/locations/${editing}`, form);
            } else {
                await api.post('/admin/locations', form);
            }
            setForm({ name: '', latitude: '', longitude: '', radius: 100 });
            setEditing(null);
            fetchLocations();
        } catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };

    const handleEdit = (loc) => {
        setEditing(loc.id);
        setForm({ name: loc.name, latitude: loc.latitude, longitude: loc.longitude, radius: loc.radius });
        setMapCenter([parseFloat(loc.latitude), parseFloat(loc.longitude)]);
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin hapus lokasi ini?')) return;
        try {
            await api.delete(`/admin/locations/${id}`);
            fetchLocations();
        } catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };

    const getCurrentGps = () => {
        if (!navigator.geolocation) {
            alert('Geolocation tidak didukung browser ini');
            return;
        }
        setGettingGps(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude.toFixed(7);
                const lng = pos.coords.longitude.toFixed(7);
                setForm(f => ({ ...f, latitude: lat, longitude: lng }));
                setMapCenter([parseFloat(lat), parseFloat(lng)]);
                setGettingGps(false);
            },
            (err) => {
                alert('Gagal mendapatkan lokasi: ' + err.message);
                setGettingGps(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleMapClick = (latlng) => {
        setForm(f => ({
            ...f,
            latitude: latlng.lat.toFixed(7),
            longitude: latlng.lng.toFixed(7),
        }));
    };

    const defaultCenter = locations.length > 0
        ? [parseFloat(locations[0].latitude), parseFloat(locations[0].longitude)]
        : [-6.2088, 106.8456];

    const formHasCoords = form.latitude && form.longitude;

    return (
        <div className="page-container">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <FiMapPin className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">Manajemen Lokasi</h1>
                    <p className="text-sm text-slate-400">Atur lokasi absensi</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Form */}
                <div className="lg:col-span-2">
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-5">
                            {editing ? 'Edit Lokasi' : 'Tambah Lokasi'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="input-label">Nama Lokasi</label>
                                <input
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Contoh: Kantor Pusat"
                                    required
                                    className="input-field"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="input-label">Latitude</label>
                                    <input
                                        type="number" step="any"
                                        value={form.latitude}
                                        onChange={e => setForm({ ...form, latitude: e.target.value })}
                                        placeholder="-6.2088"
                                        required
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="input-label">Longitude</label>
                                    <input
                                        type="number" step="any"
                                        value={form.longitude}
                                        onChange={e => setForm({ ...form, longitude: e.target.value })}
                                        placeholder="106.8456"
                                        required
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Radius (meter)</label>
                                <input
                                    type="number"
                                    value={form.radius}
                                    onChange={e => setForm({ ...form, radius: e.target.value })}
                                    min="10"
                                    required
                                    className="input-field"
                                />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={getCurrentGps}
                                    disabled={gettingGps}
                                >
                                    {gettingGps ? (
                                        <><FiLoader className="animate-spin" size={16} /> Mendapatkan GPS...</>
                                    ) : (
                                        <><FiNavigation size={16} /> Gunakan Lokasi Saat Ini</>
                                    )}
                                </button>
                                <button type="submit" className="btn-primary">
                                    <FiPlus size={16} />
                                    {editing ? 'Update' : 'Tambah'}
                                </button>
                                {editing && (
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => { setEditing(null); setForm({ name: '', latitude: '', longitude: '', radius: 100 }); }}
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Map in form */}
                        <div className="mt-5">
                            <p className="text-xs text-slate-500 mb-2">Klik pada peta untuk memilih lokasi</p>
                            <div className="rounded-xl overflow-hidden border border-slate-700/30">
                                <MapContainer
                                    center={mapCenter || defaultCenter}
                                    zoom={15}
                                    className="w-full h-[300px]"
                                    zoomControl={false}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <MapClickHandler onMapClick={handleMapClick} />
                                    {mapCenter && <MapCenter center={mapCenter} />}
                                    {formHasCoords && (
                                        <>
                                            <Marker position={[parseFloat(form.latitude), parseFloat(form.longitude)]} icon={greenIcon}>
                                                <Popup>{form.name || 'Lokasi baru'}</Popup>
                                            </Marker>
                                            <Circle
                                                center={[parseFloat(form.latitude), parseFloat(form.longitude)]}
                                                radius={parseFloat(form.radius) || 100}
                                                pathOptions={{ color: '#22c55e', fillOpacity: 0.15 }}
                                            />
                                        </>
                                    )}
                                    {locations.map(loc => (
                                        <React.Fragment key={loc.id}>
                                            <Marker position={[parseFloat(loc.latitude), parseFloat(loc.longitude)]} icon={redIcon}>
                                                <Popup>{loc.name} (radius: {loc.radius}m)</Popup>
                                            </Marker>
                                            <Circle
                                                center={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}
                                                radius={parseFloat(loc.radius)}
                                                pathOptions={{ color: '#ef4444', fillOpacity: 0.1 }}
                                            />
                                        </React.Fragment>
                                    ))}
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="lg:col-span-3">
                    <div className="glass-card overflow-hidden">
                        <div className="p-5 border-b border-slate-700/30">
                            <h2 className="text-lg font-semibold text-white">Daftar Lokasi</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table-modern">
                                <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Latitude</th>
                                        <th>Longitude</th>
                                        <th>Radius (m)</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="loading-spinner w-6 h-6" />
                                                    <span className="text-sm text-slate-500">Memuat...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : locations.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FiMapPin className="text-slate-500" size={24} />
                                                    <span className="text-sm text-slate-500">Belum ada lokasi</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : locations.map(loc => (
                                        <tr key={loc.id}>
                                            <td className="font-medium text-slate-200">{loc.name}</td>
                                            <td className="text-sm text-slate-300">{loc.latitude}</td>
                                            <td className="text-sm text-slate-300">{loc.longitude}</td>
                                            <td className="text-sm text-slate-300">{loc.radius}</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="btn-primary !py-1.5 !px-3 text-xs"
                                                        onClick={() => handleEdit(loc)}
                                                    >
                                                        <FiEdit2 size={14} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn-danger !py-1.5 !px-3 text-xs"
                                                        onClick={() => handleDelete(loc.id)}
                                                    >
                                                        <FiTrash2 size={14} />
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationManagement;
