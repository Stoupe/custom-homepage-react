import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AccountCircle } from "@material-ui/icons";
import React, { useContext, useState } from "react";
import { logInWithGoogle, logOut } from "../functions/auth";
import { UserContext } from "./Contexts";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  paper: {
    width: "5rem",
    height: "5rem",
  },
  outerContainer: {
    margin: "1rem",
    padding: "1rem",
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

  return (
    <AppBar position="static">
      <Toolbar>
        {/* <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton> */}
        <Typography variant="h6" className={classes.title} component="div">
          Bookmarks
        </Typography>
        {user ? (
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
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
