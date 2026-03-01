import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import api from '../api/axios';
import { loadModels, detectFace } from '../lib/faceModels';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from '../lib/leafletSetup';

const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const locationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const Attendance = () => {
    const webcamRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [allFaces, setAllFaces] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [selectedShift, setSelectedShift] = useState('');
    const [status, setStatus] = useState('');
    const [processing, setProcessing] = useState(false);
    const [hasFace, setHasFace] = useState(null);
    const [locations, setLocations] = useState([]);
    const [locationsLoaded, setLocationsLoaded] = useState(false);
    const [userPos, setUserPos] = useState(null);

    useEffect(() => {
        loadModels().then(() => setModelsLoaded(true));

        const loadData = async () => {
            try {
                const [facesRes, shiftsRes, meRes, locRes] = await Promise.all([
                    api.get('/users/faces'),
                    api.get('/shifts'),
                    api.get('/users/me'),
                    api.get('/locations'),
                ]);
                const faces = facesRes.data.data || [];
                setAllFaces(faces);
                setShifts(shiftsRes.data || []);
                if (shiftsRes.data?.length > 0) setSelectedShift(shiftsRes.data[0].id);

                const userId = meRes.data.data.id;
                const myFace = faces.find(f => f.user_id === userId);
                setHasFace(!!myFace);

                setLocations(locRes.data || []);
                setLocationsLoaded(true);
            } catch (err) {
                console.error('Failed to load data:', err);
                setHasFace(false);
                setLocationsLoaded(true);
            }
        };
        loadData();

        // Ambil GPS user saat halaman load untuk tampilkan di maps
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserPos({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
                () => {},
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    }, []);

    const euclideanDistance = (desc1, desc2) => {
        return Math.sqrt(desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0));
    };

    const findMatchingUser = (descriptor) => {
        let bestMatch = null;
        let bestDistance = Infinity;
        const THRESHOLD = 0.6;

        for (const face of allFaces) {
            const embedding = typeof face.face_embedding === 'string'
                ? JSON.parse(face.face_embedding) : face.face_embedding;
            const distance = euclideanDistance(descriptor, embedding);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = face;
            }
        }
        return bestDistance < THRESHOLD ? { user: bestMatch, distance: bestDistance } : null;
    };

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation tidak didukung browser ini'));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
                (err) => reject(new Error('Gagal mendapatkan lokasi: ' + err.message)),
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    };

    const handleAbsen = async (type) => {
        if (!webcamRef.current || processing) return;
        if (!selectedShift && type === 'clock-in') {
            setStatus('Pilih shift terlebih dahulu');
            return;
        }
        setProcessing(true);
        setStatus('Memverifikasi wajah...');

        try {
            const video = webcamRef.current.video;
            if (!video || video.readyState < 2) {
                setStatus('Kamera belum siap, coba lagi.');
                return;
            }

            const detection = await detectFace(video);

            if (!detection) {
                setStatus('Wajah tidak terdeteksi');
                return;
            }

            const match = findMatchingUser(Array.from(detection.descriptor));
            if (!match) {
                setStatus('Wajah tidak dikenali. Daftarkan wajah terlebih dahulu.');
                return;
            }

            // Verifikasi lokasi
            setStatus('Memverifikasi lokasi...');
            let location = null;
            try {
                location = await getLocation();
            } catch (locErr) {
                setStatus('Gagal: ' + locErr.message);
                return;
            }

            // Update posisi user di maps
            setUserPos(location);

            setStatus('Mengirim data absensi...');
            const endpoint = type === 'clock-in' ? '/clock-in' : '/clock-out';
            const payload = {
                latitude: location.latitude,
                longitude: location.longitude,
            };
            if (type === 'clock-in') payload.shift_id = selectedShift;

            await api.post(endpoint, payload);
            setStatus(`${type === 'clock-in' ? 'Clock-in' : 'Clock-out'} berhasil! (${match.user.name})`);
        } catch (err) {
            setStatus('Gagal: ' + (err.response?.data?.message || err.message));
        } finally {
            setProcessing(false);
        }
    };

    const noLocations = locationsLoaded && locations.length === 0;
    const disableButtons = processing || hasFace === false || noLocations;

    return (
        <div className="page-container">
            <h1>Absensi</h1>
            <div className="card">
                {hasFace === false && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '1em', marginBottom: '1em' }}>
                        <p style={{ color: '#991b1b', fontWeight: 500 }}>
                            Anda belum mendaftarkan wajah. Silakan ke menu <a href="/face-register" style={{ color: '#4f46e5' }}>Daftar Wajah</a> terlebih dahulu.
                        </p>
                    </div>
                )}
                {noLocations && (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '1em', marginBottom: '1em' }}>
                        <p style={{ color: '#92400e', fontWeight: 500 }}>
                            Admin belum menyimpan lokasi absensi. Absensi tidak dapat dilakukan sampai lokasi diatur.
                        </p>
                    </div>
                )}
                {modelsLoaded ? (
                    <>
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
                            style={{ width: '100%', maxWidth: 480, borderRadius: 8 }}
                        />

                        {/* Maps di bawah kamera, di atas tombol */}
                        {userPos && locations.length > 0 && (
                            <div style={{ marginTop: '1em', marginBottom: '1em' }}>
                                <h3 style={{ marginBottom: '0.5em', fontSize: '0.95em' }}>Posisi Anda & Lokasi Absensi</h3>
                                <MapContainer
                                    center={[userPos.latitude, userPos.longitude]}
                                    zoom={16}
                                    style={{ height: 250, borderRadius: 8, width: '100%', maxWidth: 480 }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[userPos.latitude, userPos.longitude]} icon={userIcon}>
                                        <Popup>Posisi Anda</Popup>
                                    </Marker>
                                    {locations.map(loc => (
                                        <React.Fragment key={loc.id}>
                                            <Marker position={[parseFloat(loc.latitude), parseFloat(loc.longitude)]} icon={locationIcon}>
                                                <Popup>{loc.name}</Popup>
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
                        )}

                        <div className="form-group mt-1" style={{ maxWidth: 300 }}>
                            <label>Shift</label>
                            <select value={selectedShift} onChange={e => setSelectedShift(e.target.value)}>
                                {shifts.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.start_time} - {s.end_time})</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-1 mt-1">
                            <button onClick={() => handleAbsen('clock-in')} className="btn-primary" disabled={disableButtons}>
                                {processing ? 'Memproses...' : 'Clock In'}
                            </button>
                            <button onClick={() => handleAbsen('clock-out')} className="btn-success" disabled={disableButtons}>
                                {processing ? 'Memproses...' : 'Clock Out'}
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Loading model...</p>
                )}
                {status && <p className="mt-1" style={{ fontWeight: 500 }}>{status}</p>}
            </div>
        </div>
    );
};

export default Attendance;
