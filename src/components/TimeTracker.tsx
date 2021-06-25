import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Box, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    paddingBottom: "1rem",
  },
  card: {
    padding: "0.5rem",
    marginBottom: "1rem",
  },
}));

const TimeTracker: React.FC = (): JSX.Element => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography className={classes.title} variant="h5">
        Time Tracking
      </Typography>
      <Paper className={classes.card} elevation={2}>
        <Typography variant="h5">ENGR 401</Typography>
        <Typography variant="body1">2 hours</Typography>
      </Paper>
      <Paper className={classes.card} elevation={2}>
        <Typography variant="h5">ENGR 401</Typography>
        <Typography variant="body1">2 hours</Typography>
      </Paper>
      <Paper className={classes.card} elevation={2}>
        <Typography variant="h5">ENGR 401</Typography>
        <Typography variant="body1">2 hours</Typography>
      </Paper>
    </Box>
  );
};

export default TimeTracker;
