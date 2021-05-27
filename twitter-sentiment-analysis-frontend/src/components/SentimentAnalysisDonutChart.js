export default function SentimentAnalysisDonutChart(props) {
    let totalAmount = props.userStats ? props.userStats.positive + props.userStats.neutral + props.userStats.negative : 0;
    let positivePercentage = props.userStats && props.userStats.positive ? (props.userStats.positive / totalAmount) * 100 : 0;
    let neutralPercentage = props.userStats && props.userStats.neutral ? (props.userStats.neutral / totalAmount) * 100 : 0;
    let negativePercentage = props.userStats && props.userStats.negative ? (props.userStats.negative / totalAmount) * 100 : 0;
    let nonNegativePercentage = props.userStats ? Math.trunc(positivePercentage + negativePercentage) : 0;

    let title = props.userStats ? "Sentiment Analysis for " + props.username : "Sentiment Analysis";

    let graphText = props.userStats ? nonNegativePercentage + "% Non-negative" : "Perform analysis";
    if (props.isLoading) {
        graphText = "Performing analysis"
    }
    const options = {
        animationEnabled: true,
        backgroundColor: "#F3F4F6",
        cornerRadius: 6,
        title: {
            padding: 14,
            text: title,
            fontFamily: "sans-serif"
        },
        subtitles: [{
            text: graphText,
            verticalAlign: "center",
            fontSize: 16,
            fontFamily: "sans-serif",
            dockInsidePlotArea: true
        }],
        data: [{
            type: "doughnut",
            showInLegend: true,
            indexLabel: "{name}: {y}",
            yValueFormatString: "#,###'%'",
            dataPoints: [
                { name: "Positive", y: positivePercentage },
                { name: "Neutral", y: neutralPercentage },
                { name: "Negative", y: negativePercentage },
            ]
        }]
    }

    return (
        <props.canvasJSChart options = {options}
            /* onRef={ref => this.chart = ref} */
        />
    )
}

