import React from 'react'
import { Card, CardTitle, CardText } from 'material-ui/Card'
import animation from '../../../images/Machine.webm'
const title = 'Make Smart Decisions With Data'

const ourGoal =
  'TechPin goal is to become the main database of Iran’s most innovative companies, based on true and transparent data, not fake advertisements. We created a powerful and scalable crowdsourcing approach to data collection leveraging a strong community of contributors, VCs and accelerators partner network, and in-house data teams armed with powerful machine learning.'

const desc =
  "TechPin's Data mining machine is the leading tool for VCs and Entrepreneurs to discover industry trends, investments, and information about Iranian companies, from startups to the most established companies."

const DataAnalysis = () => (
  <div className="data-analysis">
    <Card>
      <CardTitle>
        <h1>{title}</h1>
      </CardTitle>
      <CardText>
        <p className="desc">{desc}</p>
        <div className="animation">
          <video loop muted autoPlay>
            <source src={animation} type="video/webm" />
          </video>
        </div>
        <p className="goal">{ourGoal}</p>
      </CardText>
    </Card>
  </div>
)

export default DataAnalysis