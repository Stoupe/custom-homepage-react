import {
  Box,
  ButtonBase,
  Grid,
  Grow,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";

// const scrapFavicon = require("scrap-favicon");
// import scrapFavicon from "scrap-favicon";

const useStyles = makeStyles((theme) => ({
  box: {
    boxSizing: "border-box",
    width: "6rem",
    height: "6rem",
    padding: "0.2rem",
    borderRadius: "1.5rem",
    border: "0.5rem solid #ddd",
  },

  button: {
    flexDirection: "column",
    // borderRadius: "0.2rem",
  },

  logo: {
    width: "100%",
    height: "100%",
  },
}));

const Bookmark = ({
  title,
  url,
  img,
}: {
  title?: string;
  url?: string;
  img?: string;
}) => {
  const classes = useStyles();

  return (
    <Grid item>
      <Grow in={true}>
        <Tooltip title={url ?? "no url"} arrow>
          <ButtonBase className={classes.button} href={url}>
            <Box className={classes.box}>
              <img
                src={img ?? "logo192.png"}
                alt={title ?? "logo"}
                className={classes.logo}
              ></img>
            </Box>
            <Typography variant="subtitle2">{title ?? "No Title"}</Typography>
          </ButtonBase>
        </Tooltip>
      </Grow>
    </Grid>
  );
};

export default Bookmark;
