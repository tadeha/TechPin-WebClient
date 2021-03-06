import React from "react";
import { connect } from "react-redux";
import { Link, browserHistory } from "react-router";
import * as actions from "../../actions/actionCreators";
import { debounce } from "../../helpers/helpers";
import SearchResults from "./SearchResults";
import Modal from "react-modal";
import LoginForm from "../authentication/LoginForm";
import SignupForm from "../authentication/SignupForm";
import AppbarRightControlMobile from "./AppbarRightControlMobile";
import AppbarRightControlDesktop from "./AppbarRightControlDesktop";

import AppBar from "material-ui/AppBar";
import Drawer from "material-ui/Drawer";
import Divider from "material-ui/Divider";
import Snackbar from "material-ui/Snackbar";
import Subheader from "material-ui/Subheader";

import { List, ListItem } from "material-ui/List";

import Logo from "../../../images/techpin-logo.svg";

const modalStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)"
  }
};

const headerBreakPoint = 1050;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "login",
      aSyncCall: false,
      categories: [],
      modalIsOpen: false,
      drawerIsOpen: false,
      snackBarOpen: false,
      responseText: "",
      searchResult: [],
      SearchAsyncOngoing: false,
      hideLogo: false
    };
  }

  componentDidMount = () => {
    this.setState({ windowWidth: window.innerWidth });
    window.addEventListener("resize", () =>
      this.setState({ windowWidth: window.innerWidth })
    );
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.categories.length > 0) {
      this.setState({ categories: nextProps.categories });
    }
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false, view: "login" });
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  handleDrawerToggle = () =>
    this.setState({ drawerIsOpen: !this.state.drawerIsOpen });

  handleDrawerClose = () => this.setState({ drawerIsOpen: false });

  updateSearchTerm = event => {
    // this is redundant at the moment
    this.searchRequest(event.target.value);
  };

  searchRequest = debounce(searchTerm => {
    if (searchTerm !== "") {
      this.setState({ SearchAsyncOngoing: true });
      const { dataPromise, onCancel } = this.props.search(searchTerm);
      this.setState({ cancelSearch: onCancel });
      dataPromise
        .then(({ products }) => {
          this.setState({
            // response is an object with alphabetic keys
            searchResult: this.flattenResponse(products),
            SearchAsyncOngoing: false
          });
        })
        .catch(error => {
          this.setState({ SearchAsyncOngoing: false });
        });
    }
  }, 400);

  flattenResponse = responseObject => {
    const result = [];
    for (let char in responseObject) {
      if (responseObject.hasOwnProperty(char)) {
        result.push(...responseObject[char]);
      }
    }
    return result;
  };

  onSearchFinish = () => {
    if (this.state.cancelSearch) {
      this.state.cancelSearch();
      this.setState({ searchResult: [], hideLogo: false });
    }
    this.setState({ hideLogo: false }, () => {
      document.getElementById(
        "header-logo"
      ).parentNode.parentNode.style.minWidth =
        "175px";
    });
  };

  onSearchStart = () => {
    if (window.innerWidth <= 450) {
      document.getElementById(
        "header-logo"
      ).parentNode.parentNode.style.minWidth = 0;
      this.setState({ hideLogo: true });
    }
  };

  handleSignUp = formData => {
    if (this.state.view === "login") {
      this.setState({ view: "signup" });
    } else {
      this.setState({ aSyncCall: true });
      this.props.signupUser(formData).then(response => {
        if (response.success) {
          this.setState({
            modalIsOpen: false,
            snackBarOpen: true,
            aSyncCall: false,
            view: "login",
            responseText: "You successfuly signed up"
          });
        } else {
          let errorText = Object.values(response.detail).join(", ");
          this.setState({
            snackBarOpen: true,
            aSyncCall: false,
            responseText: errorText
          });
        }
      });
    }
  };

  handleLogOut = () => {
    this.props.logOut();
    this.setState({ responseText: "You signed out", snackBarOpen: true });
  };

  handleLogIn = (email, password) => {
    this.setState({ aSyncCall: true });
    this.props.authenticate(email, password).then(response => {
      if (response.success) {
        this.setState({
          modalIsOpen: false,
          snackBarOpen: true,
          aSyncCall: false,
          responseText: "You are now authenticated"
        });
      } else {
        this.setState({
          snackBarOpen: true,
          aSyncCall: false,
          responseText: "Failed to login, please enter valid data"
        });
      }
    });
  };

  handleRequestSnackBarClose = () => {
    this.setState({
      snackBarOpen: false
    });
  };

  handleOAuthLogIn = (isSuccessful, payload) => {
    // should dispatch 2 actions:
    // 1.call server with the token and payload.
    // 2.retrieve new token from server and save it in the store
    if (isSuccessful) {
      this.props
        .OAuthLogIn(payload)
        .then(() =>
          this.setState({
            modalIsOpen: false,
            snackBarOpen: true,
            responseText: "You are now authenticated"
          })
        )
        .catch(() => {
          this.setState({
            snackBarOpen: true,
            responseText: "Failed to login, try again"
          });
        });
    } else {
      this.setState({
        snackBarOpen: true,
        responseText: "Failed to login using your google account..."
      });
    }
  };

  render() {
    return (
      <div>
        <AppBar
          className={"app-bar"}
          title={
            this.state.hideLogo ? (
              <div />
            ) : (
              <Link to="/">
                <img
                  src={Logo}
                  alt="logo"
                  className="logo-img"
                  id="header-logo"
                />
              </Link>
            )
          }
          showMenuIconButton={false}
          iconElementRight={
            this.state.windowWidth > headerBreakPoint ? (
              <AppbarRightControlDesktop
                authenticated={this.props.authenticated}
                openModal={this.openModal}
                handleDrawerToggle={this.handleDrawerToggle}
                LogOut={this.handleLogOut}
                onSearchTermUpdate={this.updateSearchTerm}
                searchResult={this.state.searchResult}
                onSearchFinish={this.onSearchFinish}
                aSyncCall={this.state.SearchAsyncOngoing}
              />
            ) : (
              <AppbarRightControlMobile
                handleDrawerToggle={this.handleDrawerToggle}
                onSearchTermUpdate={this.updateSearchTerm}
                searchResult={this.state.searchResult}
                onSearchFinish={this.onSearchFinish}
                onSearchStart={this.onSearchStart}
                aSyncCall={this.state.SearchAsyncOngoing}
              />
            )
          }
        />
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          overlayClassName="login-singnup-overlay"
          style={modalStyle}
          className="login-signup-modal"
          contentLabel="Modal"
        >
          {this.state.view === "login" ? (
            <LoginForm
              handleOAuthLogIn={this.handleOAuthLogIn}
              handleLogIn={this.handleLogIn}
              handleSignUp={this.handleSignUp}
              aSyncCall={this.state.aSyncCall}
              key="login"
            />
          ) : (
            <SignupForm
              handleSignUp={this.handleSignUp}
              aSyncCall={this.state.aSyncCall}
              key="signup"
            />
          )}
        </Modal>
        <Drawer
          width={270}
          className="drawer"
          openSecondary={true}
          open={this.state.drawerIsOpen}
          docked={false}
          onRequestChange={open => this.setState({ drawerIsOpen: open })}
        >
          <List>
            {this.state.windowWidth < headerBreakPoint && (
              <ListItem
                primaryText={this.props.authenticated ? "LOG OUT" : "LOG IN"}
                onClick={() => {
                  this.setState({ drawerIsOpen: false });
                  this.openModal();
                }}
              />
            )}
            {this.state.windowWidth < headerBreakPoint && (
              <ListItem
                primaryText="All Products / Companies"
                onClick={() => {
                  this.setState({ drawerIsOpen: false });
                  browserHistory.push("/all-entries");
                }}
              />
            )}
            {this.state.windowWidth < headerBreakPoint && (
              <ListItem
                className="blog-btn"
                primaryText="Blog"
                href="https://blog.techpin.ir"
                target="_blank"
                style={{ textAlign: "center"}}
                innerDivStyle={{ fontWeight: "inherit" }}
              />
            )}
            <Divider />
            <Subheader style={{ paddingLeft: 0, textAlign: "center" }}>
              Categories
            </Subheader>
            {this.state.categories.map((item, i) => {
              return (
                <Link to={`/categories/${item.slug}`} key={i}>
                  <ListItem
                    primaryText={item.name_en}
                    onClick={this.handleDrawerClose}
                    style={{ textTransform: "capitalize" }}
                  />
                </Link>
              );
            })}
          </List>
        </Drawer>
        <Snackbar
          open={this.state.snackBarOpen}
          message={this.state.responseText}
          autoHideDuration={2500}
          onRequestClose={this.handleRequestSnackBarClose}
        />
        <SearchResults results={this.state.searchResult} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    categories: state.categories
  };
}
export default connect(mapStateToProps, actions)(Header);
