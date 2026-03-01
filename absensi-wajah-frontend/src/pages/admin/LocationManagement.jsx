import React, { useEffect, useState } from "react";
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

    const fetchLocations = async () => {
        try {
            const res = await api.get('/locations');
            setLocations(res.data || []);
        } catch (err) { console.error(err); }
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
            <h1>Manajemen Lokasi</h1>
            <div className="card mb-2">
                <h2>{editing ? 'Edit Lokasi' : 'Tambah Lokasi'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nama Lokasi</label>
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Kantor Pusat" required />
                    </div>
                    <div className="flex gap-1">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Latitude</label>
                            <input type="number" step="any" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} placeholder="-6.2088" required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Longitude</label>
                            <input type="number" step="any" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} placeholder="106.8456" required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Radius (meter)</label>
                            <input type="number" value={form.radius} onChange={e => setForm({ ...form, radius: e.target.value })} min="10" required />
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button type="button" className="btn-secondary" onClick={getCurrentGps} disabled={gettingGps}>
                            {gettingGps ? 'Mendapatkan GPS...' : 'Gunakan Lokasi Saat Ini'}
                        </button>
                        <button type="submit" className="btn-primary">{editing ? 'Update' : 'Tambah'}</button>
                        {editing && <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm({ name: '', latitude: '', longitude: '', radius: 100 }); }}>Batal</button>}
                    </div>
                </form>

                <div style={{ marginTop: '1em' }}>
                    <p style={{ fontSize: '0.875em', color: '#6b7280', marginBottom: '0.5em' }}>Klik pada peta untuk memilih lokasi</p>
                    <MapContainer
                        center={mapCenter || defaultCenter}
                        zoom={15}
                        style={{ height: 350, borderRadius: 8 }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapClickHandler onMapClick={handleMapClick} />
                        {mapCenter && <MapCenter center={mapCenter} />}

                        {/* Form preview marker + radius */}
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

                        {/* Existing locations */}
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

            <table>
                <thead>
                    <tr><th>Nama</th><th>Latitude</th><th>Longitude</th><th>Radius (m)</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                    {locations.length === 0 ? (
                        <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af' }}>Belum ada lokasi</td></tr>
                    ) : locations.map(loc => (
                        <tr key={loc.id}>
                            <td>{loc.name}</td>
                            <td>{loc.latitude}</td>
                            <td>{loc.longitude}</td>
                            <td>{loc.radius}</td>
                            <td>
                                <div className="flex gap-1">
                                    <button className="btn-primary" onClick={() => handleEdit(loc)}>Edit</button>
                                    <button className="btn-danger" onClick={() => handleDelete(loc.id)}>Hapus</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LocationManagement;
