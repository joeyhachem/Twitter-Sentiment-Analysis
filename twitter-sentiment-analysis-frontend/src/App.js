import './App.css';
import Banner from './components/Banner.js'
import MiniCard  from "./components/MiniCard";
import SentimentAnalysisDonutChart from "./components/SentimentAnalysisDonutChart"
import {fetchUserAnalysis} from "./services/services";
import {useState} from "react";
import Wordcloud from "./components/wordcloud";

function App() {
    let CanvasJSReact = require('./canvasjs.react').default;
    let CanvasJS = CanvasJSReact.CanvasJS;
    let CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const [stats, setStats] = useState(null);
    const [wordCloudSvg, setWordCloudSvg] = useState("");
    const [avgSentimentScore, setAvgSentimentScore] = useState(0);
    const [username, setUsername] = useState('');

    function performAnalysisEvent(inputText) {
        setUsername(inputText);
        fetchUserAnalysis(inputText).then(response => {
            if (response.stats) {
                setStats(response.stats);
            }

            if (response.average_sentiment_score >= 0) {
                let avgScorePercentage = Math.trunc(response.average_sentiment_score * 100);

                setAvgSentimentScore(avgScorePercentage);
            }

            if (response.svg) {
                setWordCloudSvg(response.svg);
            }
    });
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Banner onButtonClick={performAnalysisEvent}>
          </Banner>
          <div className="grid grid-cols-12 sm:grid-cols-12 gap-4 mt-5">
            <MiniCard title="Sentiment Score" secondary_title={`${avgSentimentScore}/ 100`}></MiniCard>
            <MiniCard title="Lorem ipsum" secondary_title="n/a"></MiniCard>
            <MiniCard title="Lorem ipsum" secondary_title="n/a"></MiniCard>
            <MiniCard title="Lorem ipsum" secondary_title="n/a"></MiniCard>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mt-10">
              <SentimentAnalysisDonutChart canvasJSChart={CanvasJSChart} userStats={stats} username={username}></SentimentAnalysisDonutChart>
              <Wordcloud wordCloudSvg={wordCloudSvg} username={username}></Wordcloud>
          </div>


      </div>
  );
}

export default App;
