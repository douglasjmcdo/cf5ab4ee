import Call from "./Call.jsx";
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const Panel = ({calldata, setCalldata, inbox, BASE_URL}) => {    
    return (
        <TransitionGroup component="div" className="panel">
            {/* todo: add un/archive button here */}
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
    );
};
export default Panel;