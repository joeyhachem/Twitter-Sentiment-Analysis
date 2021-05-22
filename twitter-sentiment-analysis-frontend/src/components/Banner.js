import TwitterLogoSvg from "../twitter-logo-svg.svg"
import React, { useState } from 'react'


export default function Banner(props) {
    const [inputText, setInputText] = useState('');

    function perform_analysis_clicked(event) {
        props.onButtonClick(inputText);
    }

    return (
                    <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
                        <div className="flex justify-start lg:w-0 lg:flex-1">
                            <a href="#">
                                <span className="sr-only">Workflow</span>
                                <img className="h-6 w-auto sm:h-10"
                                     src={TwitterLogoSvg}
                                     alt="Twitter Logo"
                                />
                            </a>
                            <p className="self-center whitespace-nowrap text-2xl font-medium text-gray-900 ml-4">Twitter Sentiment Analysis</p>
                        </div>
                        <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                            <div className="flex justify-center  mt-2 mr-4 mt-3">
                                <div className="relative flex w-full flex-wrap items-stretch mb-3">
                                    <input type="search" placeholder="@username" onChange={event => setInputText(event.target.value)}
                                           className="form-input px-3 py-2 placeholder-gray-400 text-gray-700 relative bg-white rounded-lg text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pr-10"/>
                                    <span
                                        className="z-10 h-full leading-snug font-normal  text-center text-gray-400 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 -mt-1" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={perform_analysis_clicked}
                                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-black bg-yellow-400 hover:bg-yellow-500"
                            >
                                Perform analysis
                            </button>
                        </div>
                    </div>
            )
}

