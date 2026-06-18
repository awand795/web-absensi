import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { FiCamera, FiMapPin, FiClock, FiAlertCircle, FiInfo, FiCheckCircle, FiLoader } from 'react-icons/fi';
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
    const [statusType, setStatusType] = useState('info');
    const [processing, setProcessing] = useState(false);
    const [hasFace, setHasFace] = useState(null);
    const [locations, setLocations] = useState([]);
    const [locationsLoaded, setLocationsLoaded] = useState(false);
    const [userPos, setUserPos] = useState(null);
    const [cameraReady, setCameraReady] = useState(false);

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
            setStatusType('error');
            return;
        }
        setProcessing(true);
        setStatus('Memverifikasi wajah...');
        setStatusType('info');

        try {
            const video = webcamRef.current.video;
            if (!video || video.readyState < 2) {
                setStatus('Kamera belum siap, coba lagi.');
                setStatusType('error');
                return;
            }

            const detection = await detectFace(video);

            if (!detection) {
                setStatus('Wajah tidak terdeteksi');
                setStatusType('error');
                return;
            }

            const match = findMatchingUser(Array.from(detection.descriptor));
            if (!match) {
                setStatus('Wajah tidak dikenali. Daftarkan wajah terlebih dahulu.');
                setStatusType('error');
                return;
            }

            setStatus('Memverifikasi lokasi...');
            setStatusType('info');
            let location = null;
            try {
                location = await getLocation();
            } catch (locErr) {
                setStatus('Gagal: ' + locErr.message);
                setStatusType('error');
                return;
            }

            setUserPos(location);

            setStatus('Mengirim data absensi...');
            setStatusType('info');
            const endpoint = type === 'clock-in' ? '/clock-in' : '/clock-out';
            const payload = {
                latitude: location.latitude,
                longitude: location.longitude,
            };
            if (type === 'clock-in') payload.shift_id = selectedShift;

            await api.post(endpoint, payload);
            setStatus(`${type === 'clock-in' ? 'Clock-in' : 'Clock-out'} berhasil! (${match.user.name})`);
            setStatusType('success');
        } catch (err) {
            setStatus('Gagal: ' + (err.response?.data?.message || err.message));
            setStatusType('error');
        } finally {
            setProcessing(false);
        }
    };

    const noLocations = locationsLoaded && locations.length === 0;
    const disableButtons = processing || hasFace === false || noLocations;

    const StatusAlert = ({ type, children }) => {
        const styles = {
            error: 'bg-red-500/10 border-red-500/20 text-red-300',
            warning: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
            info: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
            success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
        };
        const icons = {
            error: <FiAlertCircle size={16} />,
            warning: <FiInfo size={16} />,
            info: <FiInfo size={16} />,
            success: <FiCheckCircle size={16} />,
        };
        return (
            <div className={`flex items-start gap-2.5 p-3.5 rounded-xl border ${styles[type] || styles.info}`}>
                <span className="mt-0.5 shrink-0">{icons[type] || icons.info}</span>
                <p className="text-sm font-medium">{children}</p>
            </div>
        );
    };

    return (
        <div className="page-container">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl  flex items-center justify-center ">
                    <FiClock className="text-white" size={20} />
                </div>
                <div>
                    <h1 style={{ color: 'var(--text-heading)' }} className="text-xl font-bold">Absensi</h1>
                    <p style={{ color: 'var(--text-muted)' }} className="text-sm">Lakukan absensi dengan verifikasi wajah</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column - Camera & Controls */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="glass-card p-5">
                        {hasFace === false && (
                            <StatusAlert type="warning">
                                Anda belum mendaftarkan wajah.{' '}
                                <a href="/face-register" className="underline ml-1">
                                    Daftar Wajah
                                </a>
                            </StatusAlert>
                        )}
                        {noLocations && (
                            <StatusAlert type="warning">
                                Admin belum menyimpan lokasi absensi. Absensi tidak dapat dilakukan sampai lokasi diatur.
                            </StatusAlert>
                        )}

                        {modelsLoaded ? (
                            <>
                                {/* Camera */}
                                <div className="relative rounded-2xl overflow-hidden ">
                                    <Webcam
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
                                        className="w-full aspect-[4/3] object-cover"
                                        onUserMedia={() => setCameraReady(true)}
                                    />
                                    {!cameraReady && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
                                            <div className="flex flex-col items-center gap-2">
                                                <FiLoader className="animate-spin text-indigo-400" size={24} />
                                                <span style={{ color: 'var(--text-muted)' }} className="text-sm">Mengaktifkan kamera...</span>
                                            </div>
                                        </div>
                                    )}
                                    {/* Camera overlay */}
                                    <div className="absolute inset-0 pointer-events-none border-2 border-transparent rounded-2xl ring-1 ring-indigo-500/10" />
                                </div>

                                {/* Shift & Controls */}
                                <div className="space-y-4 mt-4">
                                    <div>
                                        <label className="input-label">Shift</label>
                                        <select
                                            value={selectedShift}
                                            onChange={e => setSelectedShift(e.target.value)}
                                            className="input-field"
                                        >
                                            {shifts.map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name} ({s.start_time} - {s.end_time})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleAbsen('clock-in')}
                                            disabled={disableButtons}
                                            className="btn-primary flex-1 py-3 text-sm"
                                        >
                                            {processing ? (
                                                <><FiLoader className="animate-spin" size={16} /> Memproses...</>
                                            ) : (
                                                <><FiCamera size={16} /> Clock In</>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleAbsen('clock-out')}
                                            disabled={disableButtons}
                                            className="btn-success flex-1 py-3 text-sm"
                                        >
                                            {processing ? (
                                                <><FiLoader className="animate-spin" size={16} /> Memproses...</>
                                            ) : (
                                                <><FiCamera size={16} /> Clock Out</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {status && (
                                    <div className="mt-4">
                                        <StatusAlert type={statusType}>{status}</StatusAlert>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <FiLoader className="animate-spin text-indigo-400" size={32} />
                                <p className="text-slate-400 text-sm">Memuat model pengenalan wajah...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Map */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <FiMapPin className="text-indigo-400" size={16} />
                            <h2 style={{ color: 'var(--text-heading)' }} className="text-sm font-semibold">Lokasi Absensi</h2>
                        </div>
                        {userPos && locations.length > 0 ? (
                            <div className="rounded-xl overflow-hidden border border-slate-700/30">
                                <MapContainer
                                    center={[userPos.latitude, userPos.longitude]}
                                    zoom={16}
                                    className="w-full h-[300px]"
                                    zoomControl={false}
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
                        ) : (
                            <div className="flex items-center justify-center h-[200px] rounded-xl ">
                                <div className="text-center">
                                    <FiMapPin className="mx-auto text-slate-500 mb-2" size={24} />
                                    <p className="text-sm text-slate-500">
                                        {locationsLoaded ? 'Tidak ada lokasi tersedia' : 'Memuat peta...'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info card */}
                    <div className="glass-card p-5">
                        <h2 className="text-sm font-semibold text-white mb-3">Informasi</h2>
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between text-sm">
                                <span style={{ color: 'var(--text-muted)' }}>Shift tersedia</span>
                                <span style={{ color: 'var(--text-primary)' }} className="font-medium">{shifts.length}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span style={{ color: 'var(--text-muted)' }}>Lokasi absensi</span>
                                <span style={{ color: 'var(--text-primary)' }} className="font-medium">{locations.length}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span style={{ color: 'var(--text-muted)' }}>Status kamera</span>
                                <span className={`font-medium ${cameraReady ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {cameraReady ? 'Aktif' : 'Menunggu...'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span style={{ color: 'var(--text-muted)' }}>Face model</span>
                                <span className={`font-medium ${modelsLoaded ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {modelsLoaded ? 'Siap' : 'Memuat...'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
