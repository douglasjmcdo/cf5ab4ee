import React, { useState } from 'react';
import answered from '../../../public/answered.png';
import inbound from '../../../public/inbound.png';
import outbound from '../../../public/outbound.png';
import voicemail  from '../../../public/voicemail.png';
import missed_call  from '../../../public/missed call.gif';

const Call = ({item, BASE_URL, calldata, setCalldata}) => {
    //constants
    const patchurl = BASE_URL + "/activities/" + item.id;
    const dateoptions = {month: "short", day: "numeric", hour: "numeric", minute: "numeric"}
    const datestring = new Date(item.created_at).toLocaleString([],dateoptions);

    //state variables
    const [expanded, setExpanded] = useState(false);
 
    // function to toggle call details
    function toggleExpand() {
        setExpanded(!expanded);
    };

    // function to un/archive individual call
    function toggleArchive() {
        //patch the database
        fetch(patchurl, {
            method: 'PATCH',
            body: JSON.stringify({
                is_archived: !item.is_archived
            }),
            headers: {
                'Content-type': 'application/json',
            },
        })
        .then((response) => {
            //once database is successfully patched, update local calldata (and by extension, item)
            let newcalldata = [...calldata];
            for (let i = 0; i < newcalldata.length; i++) {
                if (newcalldata[i].id == item.id) {
                    newcalldata[i].is_archived = !item.is_archived;
                    break;
                }
            }
            setCalldata(newcalldata);
        })
        .catch((err) => {
            console.error(err.message);
        });
    }

    return (
            <div className="call" tabIndex='0' 
            aria-label={item.direction + " call at " + datestring}
            aria-expanded={expanded}
            onClick={toggleExpand} onKeyUp={(e) => {if (e.key === "Enter") {toggleExpand()}}}>
                {/* permanent display */}
                <div className="basedisplay">
                    <img className="direction icon" 
                    src={item.direction == "outbound" ? outbound : inbound } 
                    alt={item.direction + " icon"}/>
                    <div className="whoandwhen">
                        <div className="otherparty">
                            {item.direction == "inbound" ? ("From " + item.from) : ("To " + item.to)}
                        </div>
                        <div className="time">{datestring}</div>
                    </div>
                    <img className="calltype icon" 
                    src={item.call_type == "answered" ? answered : item.call_type == "voicemail" ? voicemail : missed_call } 
                    alt={item.call_type + " icon"}/>
                </div>
                {/* displays on click */}
                <div className={expanded ? "expandeddisplay" : "expandeddisplay hidden" }>
                    <div className="extrainfo">
                        <div>To: {item.to}</div>
                        <div>From: {item.from}</div>
                        <div>Via: {item.via}</div>
                    </div>
                    <button className="archivebutton"
                    onClick={toggleArchive}>
                        {item.is_archived ? "Move to Inbox" : "Archive Call" }
                    </button>
                </div>
            </div>
    );
};
export default Call;