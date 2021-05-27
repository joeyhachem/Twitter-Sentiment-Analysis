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
    const [isLoading, setIsLoading] = useState(false);

    function performAnalysisEvent(inputText) {
        setIsLoading(true);
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
            setIsLoading(false);
    });
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Banner onButtonClick={performAnalysisEvent}>
          </Banner>
          <div className="grid grid-cols-12 sm:grid-cols-12 gap-4 mt-5">
            <MiniCard title="Sentiment Score" secondary_title={`${avgSentimentScore}/ 100`} isLoading={isLoading}></MiniCard>
            <MiniCard title="Lorem ipsum" secondary_title="n/a" isLoading={isLoading}></MiniCard>
            <MiniCard title="Lorem ipsum" secondary_title="n/a" isLoading={isLoading}></MiniCard>
            <MiniCard title="Lorem ipsum" secondary_title="n/a" isLoading={isLoading}></MiniCard>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mt-10">
              <SentimentAnalysisDonutChart canvasJSChart={CanvasJSChart} userStats={stats} username={username} isLoading={isLoading}></SentimentAnalysisDonutChart>
              <Wordcloud wordCloudSvg={wordCloudSvg} username={username} isLoading={isLoading}></Wordcloud>
          </div>


      </div>
  );
}

export default App;
