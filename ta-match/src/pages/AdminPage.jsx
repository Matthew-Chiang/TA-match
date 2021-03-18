import Dashboard from "../components/Dashboard";
import ProfessorQuestionsExport from "../components/ProfessorQuestionsExport";
import AllCourseInfo from "../components/AllCourseInfo";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import "../App.css";

const AdminPage = () => {
    return (
        <div className="container">
            <Dashboard role="administrator" />
            <h1>Welcome, <span style={{fontWeight: "normal"}}>Administrator!</span></h1>
            <ProfessorQuestionsExport />
            <h2>Course List</h2>
            <Typography component="div">
              <Box fontStyle="italic" >
              See the current TA matching results for the current semester below. 
              </Box>
          </Typography>
            <AllCourseInfo editPrivilege />
        </div>
    );
};

export default AdminPage;
