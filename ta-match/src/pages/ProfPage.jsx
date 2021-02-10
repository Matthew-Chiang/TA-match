import CourseCard from '../components/CourseCard'
import Dashboard from '../components/Dashboard'
import '../App.css'
import { useAuth } from '../contexts/AuthContext';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const ProfPage = () => {
    return <div className='prof-page'>
        <Dashboard />
        <Button variant="contained" color="primary" className="prof-button">
            New TA Application
        </Button>
        
        <h1>Welcome, Professor!</h1>
        <h3>Your Courses:</h3>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <CourseCard />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <CourseCard />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <CourseCard />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <CourseCard />
            </Grid>
        </Grid>
    </div>;
};

export default ProfPage;
