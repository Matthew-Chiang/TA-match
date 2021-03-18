import Dashboard from "../components/Dashboard";

import "../App.css";

const AdminHistoryPage = () => {
    return (
        <div className="container">
             <Dashboard role="administrator" />
            <h1>View Admin History</h1>
        </div>
    );
};

export default AdminHistoryPage;
