import Dashboard from "../components/Dashboard";
import ProfHistory from "../components/ProfHistory";

import "../App.css";

const ProfHistoryPage = () => {
    return (
        <div className="container">
             <Dashboard role="professor" />
            <ProfHistory />
        </div>
    );
};

export default ProfHistoryPage;
