import React, { Component } from "react";
import SwipeableViews from "react-swipeable-views";
import { Tabs, Tab } from "material-ui/Tabs";
import InvestmentRow from "./InvestmentRow";
export default class AboutAndInvestmentRecords extends Component {
  constructor() {
    super();
    this.state = {
      slideIndex: 0
    };
  }

  handleChange = index =>
    this.setState(() => ({
      slideIndex: index
    }));

  render() {
    const { name, desc, investedOn, investmentsDone } = this.props;
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
          inkBarStyle={{ backgroundColor: "navy" }}
          tabItemContainerStyle={{ backgroundColor: "#E8E8E8" }}
        >
          <Tab
            label={`About ${name}`}
            value={0}
            buttonStyle={{ color: "navy" }}
          />
          <Tab
            label="Investment Records"
            value={1}
            buttonStyle={{ color: "navy" }}
          />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div className="single-about" style={{ padding: "20px 0" }}>
            <p>{desc}</p>
          </div>
          {[...investmentsDone, ...investedOn].length > 0 ? (
            <div style={{ padding: "20px 0" }} className="investment-records">
              {[...investmentsDone, ...investedOn].map((item, i) => (
                <InvestmentRow key={i} {...item} />
              ))}
            </div>
          ) : (
            <li className="investment-row">No Records Yet.</li>
          )}
        </SwipeableViews>
      </div>
    );
  }
}

// {investmentsDone.map((item, i) => <InvestmentRow {...item} />)}
