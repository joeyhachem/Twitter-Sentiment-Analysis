import './animation.css';

export default function MiniCard(props) {
    return (
        <div className="shadow-xl rounded-lg col-span-12 sm:col-span-6 xl:col-span-3 bg-gray-100"
           href="#">
            <div className="p-4 ml-2 w-full flex justify-around">
                <div className="text-xl font-medium leading-8">{props.title}</div>
                { props.isLoading ? (
                    <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                ) : (
                    <div className="mt-1 text-l font-bold text-gray-600 pl-8">{props.secondary_title}</div>
                )
                }
            </div>
        </div>
    )
}

