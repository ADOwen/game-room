import React from 'react';
import '../css/legend.css'
import { CgArrowUp, CgArrowsH } from "react-icons/cg";

export const Legend = () => {
    const data = [
        [<CgArrowUp className="arrow-icon" />, 'Jump'],
        [<CgArrowsH className="arrow-icon" />, 'Run'],
        ['A', 'Magic'],
        ['S', 'Magic potion'],
        ['D', 'Health potion'],
        ['Space', 'Attack']
    ];

    return (
        <div className='legend-wrapper'>
            <h3 className='legend-title'>Legend</h3>
            <div className="legend">
                {data.map((item) => (
                    <div className="legend-item">
                        <div className="legend-key">
                            <div className="key-outline">{item[0]}</div>
                        </div>
                        <div className="legend-value">{item[1]}</div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Legend;
