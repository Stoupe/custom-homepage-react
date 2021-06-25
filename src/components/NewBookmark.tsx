import { Typography, Grid, Box, Button, Grow } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  bookmarkTitle: {
    textAlign: "center",
    marginTop: 10,
  },
  bookmarkIcon: {
    borderRadius: 2,
    boxShadow: "0 0 40px rgba(000,000,000,0.25)",
    backgroundColor: "#424242",
    height: 70,
    width: 70,
  },
}));

const NewBookmark: React.FC = (): JSX.Element => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h2" paddingBottom={1}>
        ENGR 401
      </Typography>
      <Grid container spacing={2} justifyContent={"center"}>
        <Grow in={true}>
          <Grid item paddingBottom={3}>
            <Box draggable>
              <Button className={classes.bookmarkIcon}></Button>
              <Typography
                variant="h3"
                className={classes.bookmarkTitle}
                marginTop={0.5}
              >
                Name
              </Typography>
            </Box>
          </Grid>
        </Grow>
        <Grow in={true}>
          <Grid item paddingBottom={3}>
            <Box draggable>
              <Button className={classes.bookmarkIcon}></Button>
              <Typography
                variant="h3"
                className={classes.bookmarkTitle}
                marginTop={0.5}
              >
                Name
              </Typography>
            </Box>
          </Grid>
        </Grow>
        <Grow in={true}>
          <Grid item paddingBottom={3}>
            <Box draggable>
              <Button className={classes.bookmarkIcon}></Button>
              <Typography
                variant="h3"
                className={classes.bookmarkTitle}
                marginTop={0.5}
              >
                Name
              </Typography>
            </Box>
          </Grid>
        </Grow>
      </Grid>
    </>
  );
};

export default NewBookmark;
