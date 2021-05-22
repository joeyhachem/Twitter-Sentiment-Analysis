export default function Wordcloud(props) {
    let title = props.wordCloudSvg ? "Social Key Words aggregated by " + props.username : "Social Key Words";
    return (
        <div>
            <p className="text-center font-sans whitespace-pre-wrap text-2xl font-medium text-gray-900 mb-3">{title}</p>
            { props.wordCloudSvg ?
                (<img src={`data:image/svg+xml;utf8,${props.wordCloudSvg}`}/>) :
                <p className="text-center mt-10 font-sans whitespace-nowrap text-m font-medium text-gray-500">Perform analysis by searching on the top right</p>
            }
        </div>
    )
}

