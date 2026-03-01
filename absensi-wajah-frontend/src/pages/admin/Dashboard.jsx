import { useEffect, useState } from "react";
import api from '../../api/axios';

const Dashboard = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/report/dashboard');
                setData(res.data.data || res.data || {});
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    return (
        <div className="page-container">
            <h1>Admin Dashboard</h1>
            <div className="flex gap-2 flex-wrap mt-2">
                <div className="stat-card">
                    <h3>{data.total_karyawan ?? '-'}</h3>
                    <p>Total Karyawan</p>
                </div>
                <div className="stat-card">
                    <h3>{data.hadir_hari_ini ?? '-'}</h3>
                    <p>Hadir Hari Ini</p>
                </div>
                <div className="stat-card">
                    <h3>{data.izin_hari_ini ?? '-'}</h3>
                    <p>Izin Hari Ini</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
