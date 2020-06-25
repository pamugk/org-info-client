import React from 'react';
import PropTypes from 'prop-types';

import InputBase from '@material-ui/core/InputBase';
import Search from '@material-ui/icons/Search';
import { fade, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    inputRoot: {
      color: 'inherit',
      flexGrow: 1,
      width: 'auto'
    },
    inputInput: {
      flexGrow: 1,
      padding: theme.spacing(1, 1, 1, 0),
      transition: theme.transitions.create('width'),
      width: 'auto'
    },
    search: {
      border: "1px solid black",
      display: "flex",
      flexDirection: "row",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(3),
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "auto",
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  }));

  const SearchBar = (props) => {
    const classes = useStyles();

    return <div className={classes.search}>
        <div className={classes.searchIcon}>
            <Search />
        </div>
        <InputBase
            classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
            }}
            onChange={props.onChange}
            onKeyPress={props.onKeyPress}
            placeholder={typeof props.placeholder == "undefined" ? "Поиск..." : props.placeholder}
            value={props.value}
        />
    </div>;
  };

  SearchBar.propTypes = {
    onChange: PropTypes.func,
    onKeyPress: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired
  };

  export default SearchBar;
  