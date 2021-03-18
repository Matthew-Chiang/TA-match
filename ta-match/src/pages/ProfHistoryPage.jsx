import Dashboard from "../components/Dashboard";
import ProfHistory from "../components/ProfHistory";

import "../App.css";

const ProfHistoryPage = () => {
    return (
        <div className="container">
             <Dashboard role="prof" />
            {/* <h1>View Prof History</h1> */}
            <ProfHistory />
        </div>
    );
};

export default ProfHistoryPage;
