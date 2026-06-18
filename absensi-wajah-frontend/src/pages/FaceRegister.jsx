import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { FiCamera, FiLoader, FiCheckCircle, FiAlertCircle, FiInfo, FiUserPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { loadModels, detectFace } from '../lib/faceModels';
import Alert from '../components/Alert';

const FaceRegister = () => {
    const webcamRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [status, setStatus] = useState('');
    const [statusType, setStatusType] = useState('info');
    const [processing, setProcessing] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadModels().then(() => setModelsLoaded(true));
    }, []);

    const handleRegister = async () => {
        if (!webcamRef.current || processing) return;
        setProcessing(true);
        setStatus('Mendeteksi wajah...');
        setStatusType('info');
        setSuccess(false);

        try {
            const video = webcamRef.current.video;
            if (!video || video.readyState < 2) {
                setStatus('Kamera belum siap, coba lagi.');
                setStatusType('error');
                return;
            }

            const detection = await detectFace(video);

            if (!detection) {
                setStatus('Wajah tidak terdeteksi. Pastikan pencahayaan cukup dan wajah menghadap kamera.');
                setStatusType('error');
                return;
            }

            setStatus('Menyimpan data wajah...');
            setStatusType('info');
            const faceDescriptor = Array.from(detection.descriptor);
            await api.put('/users/faces', { face_embedding: faceDescriptor });
            setStatus('Wajah berhasil didaftarkan!');
            setStatusType('success');
            setSuccess(true);
        } catch (err) {
            setStatus('Gagal: ' + (err.response?.data?.message || err.message));
            setStatusType('error');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="page-container">
            <div className="flex items-center gap-3 mb-6">
                <div className="icon-wrap">
                    <FiCamera size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Daftar Wajah</h1>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Daftarkan wajah Anda untuk absensi</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="glass-card p-6">
                    {modelsLoaded ? (
                        <div className="space-y-5">
                            {/* Camera */}
                            <div className="relative rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                                <Webcam
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
                                    className="w-full aspect-[4/3] object-cover"
                                    onUserMedia={() => setCameraReady(true)}
                                />
                                {!cameraReady && (
                                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'var(--bg-overlay)' }}>
                                        <div className="flex flex-col items-center gap-2">
                                            <FiLoader className="animate-spin" style={{ color: '#d45a4a' }} size={24} />
                                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Mengaktifkan kamera...</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Tips */}
                            <div className="p-4 rounded-xl" style={{ background: 'rgba(212,90,74,0.05)', border: '1px solid rgba(212,90,74,0.12)' }}>
                                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#d45a4a' }}>
                                    <FiInfo size={14} />
                                    Tips Pendaftaran
                                </h3>
                                <ul className="text-xs space-y-1 list-disc list-inside" style={{ color: 'var(--text-secondary)' }}>
                                    <li>Pastikan wajah terlihat jelas dan menghadap kamera</li>
                                    <li>Gunakan pencahayaan yang cukup</li>
                                    <li>Hindari aksesoris yang menutupi wajah</li>
                                    <li>Posisikan wajah di tengah frame</li>
                                </ul>
                            </div>

                            {/* Register Button */}
                            <button
                                onClick={handleRegister}
                                disabled={processing || !cameraReady}
                                className="btn-primary w-full py-3 text-base"
                            >
                                {processing ? (
                                    <><FiLoader className="animate-spin" size={18} /> Memproses...</>
                                ) : success ? (
                                    <><FiCheckCircle size={18} /> Wajah Terdaftar</>
                                ) : (
                                    <><FiUserPlus size={18} /> Daftarkan Wajah</>
                                )}
                            </button>

                            {status && <Alert type={statusType}>{status}</Alert>}

                            {success && (
                                <div className="text-center">
                                    <Link to="/attendance"
                                        className="inline-flex items-center gap-2 text-sm transition-colors link-primary"
                                    >
                                        <FiCamera size={16} />
                                        Lanjutkan ke Absensi
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <FiLoader className="animate-spin" style={{ color: '#d45a4a' }} size={32} />
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Memuat model pengenalan wajah...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FaceRegister;
