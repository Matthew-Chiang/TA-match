import Dashboard from "../components/Dashboard";
import HistoricalData from "../components/HistoricalData";

import "../App.css";

const AdminHistoryPage = () => {
    return (
        <div className="container">
             <Dashboard role="administrator" />
             <HistoricalData />
        </div>
    );
};

export default AdminHistoryPage;
