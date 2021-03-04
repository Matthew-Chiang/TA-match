import Dashboard from "../components/Dashboard";
import ProfessorQuestionsExport from "../components/ProfessorQuestionsExport";

const AdminPage = () => {
    return (
        <div>
            <Dashboard /><br></br>
            <h1>Admin Page</h1>
            <ProfessorQuestionsExport />
        </div>
    );
};

export default AdminPage;
