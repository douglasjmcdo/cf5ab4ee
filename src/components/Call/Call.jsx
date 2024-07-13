import React, { useState } from 'react';
const Call = ({item, BASE_URL, calldata, setCalldata}) => {
    //constants
    const patchurl = BASE_URL + "/activities/" + item.id;
    const dateoptions = {month: "short", day: "numeric", hour: "numeric", minute: "numeric"}
    const datestring = new Date(item.created_at).toLocaleString([],dateoptions);
    const directionsrc = './public/' + item.direction + '.png'

    //determine whether call_type img will be gif or png
    let typesrc = './public/' + item.call_type;
    if (item.call_type == "missed_call") {
        typesrc += ".gif";
    } else {
        typesrc += ".png";
    }

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
            <div className="call" onClick={() => toggleExpand()}>
                {/* permanent display */}
                <div className="basedisplay">
                    <img className="direction icon" src={directionsrc}/>
                    <div className="whoandwhen">
                        <div className="otherparty">
                            {item.direction == "inbound" ? ("From " + item.from) : ("To " + item.to)}
                        </div>
                        <div className="time">{datestring}</div>
                    </div>
                    <img className="calltype icon" src={typesrc}
                    />
                </div>
                {/* displays on click */}
                <div className={expanded ? "expandeddisplay" : "expandeddisplay hidden" }>
                    <div className="extrainfo">
                        <div>To: {item.to}</div>
                        <div>From: {item.from}</div>
                        <div>Via: {item.via}</div>
                    </div>
                    <button className="archivebutton"
                    onClick={() => toggleArchive()}>
                        {item.is_archived ? "Move to Inbox" : "Archive Call" }
                    </button>
                </div>
            </div>
    );
};
export default Call;