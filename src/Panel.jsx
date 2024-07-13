import Call from "./Call.jsx";
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const Panel = ({calldata, setCalldata, inbox, BASE_URL}) => {   

    // function to mass un/archive ALL posts
    function toggleAll() {
        const reseturl = BASE_URL + "/reset";
        const patchbaseurl = BASE_URL + "/activities/";

        if (inbox == "Inbox") {
            //archive all posts. no mass-archive API available
            let error = false;
            for (let i = 0; i < calldata.length; i++) {
                //to avoid unnecessary API calls, we skip any currently archived calls
                if (!calldata[i].is_archived) {
                    const patchurl = patchbaseurl + calldata[i].id;
                    fetch(patchurl, {
                        method: 'PATCH',
                        body: JSON.stringify({
                            is_archived: true
                        }),
                        headers: {
                            'Content-type': 'application/json',
                        },
                    })
                    .then((response) => {})
                    .catch((err) => {
                        error = err;
                        console.error(err.message);
                    });
                }
            }

            //once the entire database is successfully patched w/out error, update local calldata
            if (!error) {
                let newcalldata = [...calldata];
                for (let i = 0; i < newcalldata.length; i++) {
                    newcalldata[i].is_archived = true;
                }
                setCalldata(newcalldata);
            }
            
        } else {
            //reset all using reset API
            fetch(reseturl, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json',
                },
            })
            .then((response) => {
                //once database is successfully patched, reset local calldata
                let newcalldata = [...calldata];
                for (let i = 0; i < newcalldata.length; i++) {
                    newcalldata[i].is_archived = false;
                }
                setCalldata(newcalldata);
            })
            .catch((err) => {
                console.error(err.message);
            });

        }
    }
    
    return (
        <div className="panel">
            <TransitionGroup component="div">                
                {calldata && calldata.filter(raw => (raw.is_archived === false && inbox == "Inbox" ||
                                        raw.is_archived === true && inbox == "Archived"))
                .map((item) => {
                    return (
                        <CSSTransition key={item.id} timeout={300} classNames='callanim'>
                            <Call item={item} BASE_URL={BASE_URL} key={item.id}
                            calldata={calldata} setCalldata={setCalldata}
                            />
                        </CSSTransition>
                    )
                })}
            </TransitionGroup>
            <button
                    className="masstogglebtn"
                    onClick={() => toggleAll()}
            >
                    {inbox == "Inbox" ? "Archive All" : "Reset All" }
            </button>
        </div>
    );
};
export default Panel;