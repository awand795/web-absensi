import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { FiCamera, FiLoader, FiCheckCircle, FiAlertCircle, FiInfo, FiUserPlus } from 'react-icons/fi';
import api from '../api/axios';
import { loadModels, detectFace } from '../lib/faceModels';

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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <FiCamera className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">Daftar Wajah</h1>
                    <p className="text-sm text-slate-400">Daftarkan wajah Anda untuk absensi</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="glass-card p-6">
                    {modelsLoaded ? (
                        <div className="space-y-5">
                            {/* Camera */}
                            <div className="relative rounded-2xl overflow-hidden bg-slate-900/50 border border-slate-700/30">
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
                                            <span className="text-sm text-slate-400">Mengaktifkan kamera...</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Tips */}
                            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                                <h3 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                                    <FiInfo size={14} />
                                    Tips Pendaftaran
                                </h3>
                                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
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

                            {status && <StatusAlert type={statusType}>{status}</StatusAlert>}

                            {success && (
                                <div className="text-center">
                                    <a
                                        href="/attendance"
                                        className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                                    >
                                        <FiCamera size={16} />
                                        Lanjutkan ke Absensi
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <FiLoader className="animate-spin text-indigo-400" size={32} />
                            <p className="text-slate-400 text-sm">Memuat model pengenalan wajah...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FaceRegister;
