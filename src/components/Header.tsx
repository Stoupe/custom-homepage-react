import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { AccountCircle } from "@material-ui/icons";
import React, { useContext, useState } from "react";
import { logInWithGoogle, logOut } from "../functions/auth";
import { BookmarksContext, UserContext } from "./Contexts";
import EditIcon from "@material-ui/icons/Edit";
import GitHubIcon from "@material-ui/icons/GitHub";
import { title } from "process";

const useStyles = makeStyles((theme) => ({
  root: {},
  toolbar: { display: "flex" },
  menuButton: {
    // marginRight: theme.spacing(2),
  },
  title: {
    // height: "100%",
    flexGrow: 1,
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  left: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Header: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { setEditingView } = useContext(BookmarksContext);

  return (
    <AppBar position="static" className={classes.root} enableColorOnDark>
      <Toolbar className={classes.toolbar}>
        {/* <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton> */}
        <Typography variant="h1" className={classes.title}>
          Home
        </Typography>
        <IconButton
          color="inherit"
          href={"https://github.com/Stoupe/custom-homepage-react"}
          target="_blank"
        >
          <GitHubIcon />
        </IconButton>
        {user ? (
          <div>
            <IconButton
              onClick={() => {
                setEditingView((prevState) => !prevState);
              }}
              color="inherit"
            >
              <EditIcon />
            </IconButton>

            <IconButton onClick={handleMenu} color="inherit">
              <AccountCircle />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  logOut()
                    .then((user) => {
                      setUser(user);
                      console.log("logged out");
                      handleClose();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                Log Out
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <div>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => {
                logInWithGoogle()
                  .then((user) => {
                    setUser(user);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              Log in with Google
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
