import React, { Component } from "react";
import { browserHistory } from "react-router";
import FlatButton from "material-ui/FlatButton";
import SearchBar from "./SearchInput";

const wrapperStyle = {
  height: 40,
  display: "inline-flex",
  alignContent: "center",
  alignItems: "center"
};

class AppbarRightControlDesktop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInputIsFocused: false
    };
  }
  handleSearchFocus = () => {
    this.setState({ searchInputIsFocused: true });
  };

  handleSearchBlur = () => {
    this.setState({ searchInputIsFocused: false });
    this.props.onSearchFinish();
  };

  render() {
    const { searchInputIsFocused } = this.state;
    const {
      authenticated,
      openModal,
      LogOut,
      handleDrawerToggle,
      onSearchTermUpdate,
      searchResult,
      aSyncCall
    } = this.props;
    return (
      <div style={wrapperStyle}>
        <SearchBar
          searchResult={searchResult}
          onChange={onSearchTermUpdate}
          onFocus={this.handleSearchFocus}
          onBlur={this.handleSearchBlur}
          isDesktop={true}
          aSyncCall={aSyncCall}
        />
        {!searchInputIsFocused && (
          <FlatButton
            label={authenticated ? "logout" : "login"}
            onClick={() => {
              if (!authenticated) {
                openModal();
              } else {
                LogOut();
              }
            }}
          />
        )}
        {!searchInputIsFocused && (
          <FlatButton
            label="All Products / Companies"
            onTouchTap={() => browserHistory.push("/all-entries")}
          />
        )}
        {!searchInputIsFocused && (
          <FlatButton
            label="categories / markets"
            onTouchTap={handleDrawerToggle}
          />
        )}
        {!searchInputIsFocused && (
          <FlatButton
            label="Blog"
            href="https://blog.techpin.ir"
            target="_blank"
            style={{ color: "#0d47a1" }}
          />
        )}
      </div>
    );
  }
}

export default AppbarRightControlDesktop;
