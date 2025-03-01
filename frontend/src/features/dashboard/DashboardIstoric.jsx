import { React } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DashboardIstoric.scss';
import IstoricTable from './IstoricTable';
import IstoricLine from './IstoricLine';
import IstoricPie from './IstoricPie';

export default function DashboardIstoric() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleButtonClick = (route) => {
        navigate(route);
    };

    const buttonConfig = [
        { path: '/dashboard/istoric', label: 'Table', id: 'tabel', component: <IstoricTable /> },
        { path: '/dashboard/istoric/line', label: 'Line Chart', id: 'line-chart', component: <IstoricLine /> },
        { path: '/dashboard/istoric/pie', label: 'Pie Chart', id: 'pie-chart', component: <IstoricPie /> },
    ];

    return (
        <div className="afisare">
            <div className="optiuni-afisare">
                {buttonConfig.map(({ path, label, id }) => (
                    <button
                        key={id}
                        id={id}
                        className={location.pathname === path ? 'active' : ''}
                        onClick={() => handleButtonClick(path)}>
                        {label}
                    </button>
                ))}
            </div>
            <div className="istoric-content">
                {buttonConfig.find((button) => button.path === location.pathname)?.component}
            </div>
        </div>
    );
}
