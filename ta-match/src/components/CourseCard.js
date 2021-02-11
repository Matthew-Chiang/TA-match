import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginTop: 6,
  },
});

export default function CourseCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Software Engineering
        </Typography>
        <Typography variant="h5" component="h2">
          SE 3350
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Winter 2021
        </Typography>
      </CardContent>
      <CardActions>
        <Grid container justify="flex-end">
            <Button size="small">View Applications</Button>
        </Grid>
      </CardActions>
    </Card>
  );
}
