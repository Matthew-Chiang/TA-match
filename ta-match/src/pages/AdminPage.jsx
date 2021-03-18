import Dashboard from "../components/Dashboard";
import ProfessorQuestionsExport from "../components/ProfessorQuestionsExport";
import AllCourseInfo from "../components/AllCourseInfo";

import "../App.css";

const AdminPage = () => {
    return (
        <div className="container">
            <Dashboard role="administrator" />
            <h1>Welcome, <span style={{fontWeight: "normal"}}>Administrator!</span></h1>
            <ProfessorQuestionsExport />
            <AllCourseInfo editPrivilege />
        </div>
    );
};

export default AdminPage;
