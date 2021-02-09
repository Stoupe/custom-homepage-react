import {
  Tooltip,
  Grid,
  Paper,
  Typography,
  makeStyles,
  Link,
  Button,
  ButtonBase,
  Box,
} from "@material-ui/core";
import TouchRipple from "@material-ui/core/ButtonBase/TouchRipple";
import { title } from "process";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  box: {
    boxSizing: "border-box",
    width: "6rem",
    height: "6rem",
    padding: "0.2rem",
    borderRadius: "1rem",
    border: "0.5rem solid #eee",
  },

  button: {
    flexDirection: "column",
    borderRadius: "0.2rem",
  },

  logo: {
    width: "100%",
    height: "100%",
  },
}));

const Bookmark = ({
  key,
  title,
  url,
  img,
}: {
  key: number;
  title?: string;
  url?: string;
  img?: string;
}) => {
  const classes = useStyles();

  return (
    <Tooltip title={url ?? "no url"} arrow>
      <Grid item>
        <ButtonBase className={classes.button} href={url}>
          <Box key={key} className={classes.box}>
            <img
              src={img ?? "logo192.png"}
              alt={title ?? "logo"}
              className={classes.logo}
            ></img>
          </Box>
          <Typography variant="subtitle1">{title ?? "No Title"}</Typography>
        </ButtonBase>
      </Grid>
    </Tooltip>
  );
};

export default Bookmark;
