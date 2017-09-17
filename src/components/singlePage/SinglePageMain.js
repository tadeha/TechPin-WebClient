import React, { PropTypes } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/actionCreators";

import CommentRow from "./CommentRow";
import VisualInfo from "./VisualInfo";
import CommentBox from "./CommentBox";
import StartupWidgetMoreInfo from "./StartupWidgetMoreInfo";
import SocialNetworks from "./SocialNetworks";
import ContactInfo from "./ContactInfo";
import Rate from "./Rate";
import AboutAndInvestmentRecords from "./AboutAndInvestmentRecords";

import Paper from "material-ui/Paper";
import Snackbar from "material-ui/Snackbar";

const styles = {
  paper: {
    Width: "100%"
  }
};

class SinglePageMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: {},
      product: {},
      comments: [],
      username: "",
      commentAsyncCall: false,
      snackBarIsOpen: false,
      snackBarText: ""
    };
  }

  componentWillMount = () => {
    this.setState({
      product: this.props.product.product,
      comments: this.props.product.comments
    });
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.username) {
      this.setState({ username: nextProps.username });
    }

    if (nextProps.product) {
      this.setState({
        product: nextProps.product.product,
        comments: nextProps.product.comments
      });
    }
  };

  handlePostComment = commentData => {
    if (this.props.authenticated) {
      if (commentData.text.length > 1) {
        this.setState({ commentAsyncCall: true });
        this.props
          .postNewComment(commentData, this.props.product.product.slug)
          .then(response => {
            this.setState({ commentAsyncCall: false });
            document.querySelector("#comment-field").value = "";
          });
      }
    } else {
      this.setState({
        snackBarIsOpen: true,
        snackBarText: "please login first"
      });
    }
  };

  handlePostRate = (rate, slug) => {
    if (this.props.authenticated) {
      this.props.postNewRate(rate, slug).then(res => {
        this.setState({
          rating: {
            rating: res.data.new_p_rate,
            rateCount: res.data.p_rate_count
          },
          snackBarIsOpen: true,
          snackBarText: "Successfuly submited your rate",
          userRated: true
        });
      });
    } else {
      this.setState({
        snackBarIsOpen: true,
        snackBarText: "please login first"
      });
    }
  };

  handleSnackBarClose = () => {
    this.setState({
      snackBarIsOpen: false
    });
  };

  render() {
    if (this.state.product) {
      var name = this.state.product.name_en || "";
      var details = this.state.product.details;
      if (details) {
        var desc = details.description_en;
      } else {
        desc = "";
      }
    }
    const comments = this.state.comments || [];
    const socialData = {
      ios: this.state.product.details.ios_app,
      android: this.state.product.details.android_app,
      linkedin: this.state.product.details.linkedin,
      instagram: this.state.product.details.instagram,
      twitter: this.state.product.details.twitter
    };
    const contactData = {
      email: this.state.product.details.email,
      extraUrl: this.state.product.details.extra_url,
      website: this.state.product.website
    };

    const investedOn = this.state.product.investments_received || [];

    const investmentsDone = this.state.product.investments_done || [];

    return (
      <div id="single-page-main-container">
        <div className="second-column">
          <div id="single-page-main-content">
            <Paper
              className="detail-and-rating-wrapper"
              style={styles.paper}
              zDepth={1}
            >
              {/* {this.props.children} */}
              <StartupWidgetMoreInfo product={this.state.product || {}} />
              <div className="rating">
                <Rate
                  name={name}
                  userRate={
                    this.props.userRate ? this.props.userRate.rate : undefined
                  }
                  slug={this.state.product.slug}
                  submitRate={this.handlePostRate}
                  authenticated={this.props.authenticated}
                />
              </div>
            </Paper>
            <VisualInfo
              slug={this.props.slug}
              auth={this.props.auth}
              handleInvRecAdd={this.props.handleInvRecAdd}
              average_p_rate={
                this.state.rating.rating ||
                this.props.product.product.average_p_rate
              }
              rate_count={
                this.state.rating.rateCount ||
                this.props.product.product.rate_count
              }
              n_p_score={this.props.product.product.n_p_score}
              employeesCount={
                this.props.product.product.details.employees_count
              }
              year={this.props.product.product.details.year}
            />
          </div>
          <div style={styles.paper} className="about-inv-visual-wrapper">
            <div className="detailed-info">
              <AboutAndInvestmentRecords
                name={name}
                desc={desc}
                investedOn={investedOn}
                investmentsDone={investmentsDone}
              />
            </div>
            <Paper
              className="social-and-contact-wrapper"
              style={styles.paper}
              zDepth={1}
            >
              <div className="contact-info">
                <ContactInfo contactData={contactData} />
              </div>
              <div className="single-socials">
                {this.state.product && (
                  <SocialNetworks socialData={socialData} />
                )}
              </div>
            </Paper>
          </div>
          <Paper style={styles.paper} zDepth={1}>
            <div className="comments">
              <span className="comment-title">Comments</span>
              {comments.map((comment, i) => (
                <CommentRow comment={comment} key={i} />
              ))}
              <CommentBox
                authenticated={this.props.authenticated}
                handlePostComment={this.handlePostComment}
                commentAsyncCall={this.state.commentAsyncCall}
              />
            </div>
          </Paper>
        </div>

        <Snackbar
          open={this.state.snackBarIsOpen}
          message={this.state.snackBarText}
          autoHideDuration={7000}
          onRequestClose={this.handleSnackBarClose}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    username: state.auth.username,
    rateCount: state.topProducts
  };
}
export default connect(mapStateToProps, actions)(SinglePageMain);
