import Dashboard from "../components/Dashboard";
import HistoricalData from "../components/HistoricalData";

import "../App.css";

const ChairHistoryPage = () => {
    return (
        <div className="container">
            <Dashboard role="chair" />
            <HistoricalData />
        </div>
    );
};

export default ChairHistoryPage;
