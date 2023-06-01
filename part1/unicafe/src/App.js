import { useState } from 'react';

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>
const StatisticLine  = ({text, stat}) => (
<tr>
  <td>{text}</td>
  <td>{stat}</td>
</tr>
)
const Statistics = (props) => {
  if (props.noVoteStage) {
    return <p>No feedback given</p>
  }
return <>
  <table>
    <tbody>
      <StatisticLine text={props.text1} stat={props.stat1}/>
      <StatisticLine text={props.text2} stat={props.stat2}/>
      <StatisticLine text={props.text3} stat={props.stat3}/>
      <StatisticLine text={props.text4} stat={props.stat4}/>
      <StatisticLine text={props.text5} stat={props.stat5}/>
    </tbody>
  </table>
  </>
}
const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const voteGood = () => setGood(good + 1)
  const voteNeutral = () => setNeutral(neutral + 1)
  const voteBad = () => setBad(bad + 1)
  // noVotaStage is true, if all states===0 (refreshing app)
  const noVoteStage = Boolean(good ===0 && neutral===0& bad===0)
  const average = () => {
    const n = (good-bad)/(good+neutral+bad)
  return n.toFixed(2)
  }
  const positive = () => {
    const n = (good)*100/(good+neutral+bad);
  return n.toFixed(2) + '%'
  }
    
  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={voteGood} text='good' />
      <Button handleClick={voteNeutral} text='neutral' />
      <Button handleClick={voteBad} text='bad' />
      <h2>statistics</h2>
      <Statistics noVoteStage={noVoteStage} 
      text1='good' stat1={good}
      text2='neutral' stat2={neutral}
      text3='bad' stat3={bad}
      text4='averege' stat4={average()}
      text5='positive' stat5={positive()}
      />
    </div>
  )
}

export default App
